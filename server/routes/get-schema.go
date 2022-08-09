package nebula

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	st "github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/pkg/hwid"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type QuerySchema struct {
	Did     string `json:"did"`
	Creator string `json:"creator"`
	Schema  string `json:"schema"`
}

// @BasePath /api/v1
// @Summary GetSchema
// @Schemes
// @Description Get a schema utilizing motor client. Returns the WhatIs of the schema that is retrieved.
// @Tags schema
// @Produce json
// @Param did query string true "Did"
// @Param creator query string true "Creator"
// @Param schema query string true "Schema"
// @Success      200  {object} st.SchemaDefinition
// @Failure      500  {string} message error
// @Router /schema/get [post]
func (ns *NebulaServer) QuerySchema(c *gin.Context) {
	rBody := c.Request.Body
	var r QuerySchema
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	hwid, err := hwid.GetHwid()
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Could not get hardware id",
		})
		return
	}
	m := mtr.EmptyMotor(hwid)
	// TODO: Call login from registry service
	aesKey, err := loadKey("AES.key")
	if err != nil {
		fmt.Println("err", err)
	}
	aesPskKey, err := loadKey("PSK.key")
	if err != nil {
		fmt.Println("err", err)
	}
	// * Create a new login & create schema request
	// Create a new login request
	loginRequest := (rtmv1.LoginRequest{
		Did:       r.Did,
		AesDscKey: aesKey,
		AesPskKey: aesPskKey,
	})
	loginResponse, err := m.Login(loginRequest)
	// if login fails, return error
	if loginResponse.Success {
		fmt.Println(chalk.Green, "Login successful")
	} else {
		fmt.Println(chalk.Red, "Login failed")
		c.JSON(500, gin.H{
			"error": "Login failed",
		})
		return
	}
	fmt.Println("loginResponse", loginResponse)
	// Create a new create schema request
	querySchema := rtmv1.QueryWhatIsRequest{
		Creator: r.Creator,
		Did:     r.Schema,
	}
	querySchemaResponse, err := m.QueryWhatIs(context.Background(), querySchema)
	// deserialize result
	whatIs := &st.WhatIs{}
	err = whatIs.Unmarshal(querySchemaResponse.WhatIs)
	if err != nil {
		fmt.Printf("Unmarshal failed %v\n", err)
		return
	}
	// print result
	fmt.Println(chalk.Blue, "Schema:", whatIs.Schema)
	// create a new get request to ipfs.sonr.ws with cid
	getReq, err := http.NewRequest("GET", "https://ipfs.sonr.ws/ipfs/"+whatIs.Schema.Cid, nil)
	if err != nil {
		fmt.Printf("Request to IPFS failed %v\n", err)
		return
	}
	// get the file from ipfs.sonr.ws
	resp, err := http.DefaultClient.Do(getReq)
	if err != nil {
		fmt.Printf("Do failed %v\n", err)
		return
	}
	// read the file
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("ReadAll failed %v\n", err)
		return
	}
	definition := &st.SchemaDefinition{}
	if err = definition.Unmarshal(body); err != nil {
		fmt.Printf("error unmarshalling body: %s", err)
		return
	}
	// print response
	fmt.Println(chalk.Green, "\n", definition, chalk.Reset)
	c.JSON(200, gin.H{
		"schema": definition,
	})
}
