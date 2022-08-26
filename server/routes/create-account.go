package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/crypto/mpc"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/storage"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
)

type CARequestBody struct {
	Password string `json:"password"`
}

// @BasePath /api/v1
// @Summary CreateAccount
// @Schemes
// @Description Create a new account on Sonr using the Registry module of Sonr's Blockchain.
// @Tags account
// @Produce json
// @Param 		 password body string true "Password"
// @Success 	 200  {string}  message "Address"
// @Failure      500  {string}  message "Error"
// @Router /account/create [post]
func (ns *NebulaServer) CreateAccount(c *gin.Context) {
	rBody := c.Request.Body
	var body CARequestBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	aesKey, err := mpc.NewAesKey()
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not generate AES key",
		})
		return
	}
	store, err := storage.Store("dsc", aesKey)
	if err != nil {
		fmt.Println("Keyring Error", err)
	}
	fmt.Println("Store", store)

	req := rtmv1.CreateAccountRequest{
		Password:  body.Password,
		AesDscKey: aesKey,
	}
	b := binding.CreateInstance()

	res, err := b.CreateAccount(req)
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could Not Create Account",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Address": res.Address,
	})
}
