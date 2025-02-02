package routes

import (
	"encoding/base64"
	"fmt"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

type BuildObjectBody struct {
	SchemaDid string                 `json:"schemaDid"`
	Label     string                 `json:"label"`
	Object    map[string]interface{} `json:"object"`
}

// @BasePath /api/v1
// @Summary BuildObject
// @Schemes
// @Description Build an object on Sonr using the object module of Sonr's Blockchain.
// @Tags Object
// @Accept json
// @Produce json
// @Param SchemaDid body string true "schemaDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param Label body string true "label" example("MyObject")
// @Param Object body map[string]interface{} true "object" example({"name": "John Doe"})
// @Success 200 {object} rtmv1.UploadObjectResponse
// @Failure 500  {object}  FailedResponse
// @Router /object/build [post]
func (ns *NebulaServer) BuildObject(c *gin.Context) {
	var body BuildObjectBody
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	label := body.Label
	// init motor
	b := ns.Config.Binding

	// query whatis
	did := b.Instance.GetDID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to get DID",
		})
		return
	}

	// query whatis req
	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: did.String(),
		Did:     body.SchemaDid,
	}

	querySchema, err := b.Instance.QueryWhatIs(querySchemaReq)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return
	}
	fmt.Printf("Schema WhatIs Response %v\n", querySchema)

	// Initialize NewObjectBuilder
	objBuilder, err := b.Instance.NewObjectBuilder(body.SchemaDid)
	if err != nil {
		fmt.Println("ObjectBuilder Error: ", err)
		c.JSON(http.StatusUnprocessableEntity, FailedResponse{
			Error: err.Error(),
		})
	}

	objBuilder.SetLabel(label)

	// Iterate through object and add to builder
	for k, v := range body.Object {
		// TODO: this is a hack, for floats to typecast to int type, will throw bad things if it cant. which means it should stay a float.
		// using the error on the typecast to know when something "is" a float.
		switch v.(type) {
		case float32:
			value := float64(v.(float32))
			if _, rem := math.Modf(value); rem > 0 {
				objBuilder.Set(k, value)
			} else {
				objBuilder.Set(k, int32(value))
			}
			continue
		case float64:
			value := float64(v.(float64))
			if _, rem := math.Modf(value); rem > 0 {
				objBuilder.Set(k, value)
			} else {
				objBuilder.Set(k, int64(value))
			}
			continue
		case map[string]interface{}:
			value := v.(map[string]interface{})
			if base64String, ok := value["bytes"]; ok {
				rawDecodedString, _ := base64.StdEncoding.DecodeString(base64String.(string))
				bytes := []byte(rawDecodedString)
				objBuilder.Set(k, bytes)
			}
			continue
		default:
			objBuilder.Set(k, v)
			continue
		}
	}

	// Upload the object
	upload, err := objBuilder.Upload()
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
	}
	c.JSON(http.StatusOK, upload)
}
