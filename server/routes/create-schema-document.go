package routes

import (
	"net/http"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/x/schema/types"
)

type CreateSchemaDocumentRequest struct {
	Creator   string                       `json:"creator"`
	Label     string                       `json:"label"`
	SchemaDid string                       `json:"schema_did"`
	Fields    []*types.SchemaDocumentValue `json:"fields"`
}

// @BasePath /api/v1
// @Summary CreateSchemaDocument
// @Schemes
// @Description Create a new schema document on Sonr using the Registry module of Sonr's Blockchain.
// @Tags Schema Document
// @Accept json
// @Produce json
// @Param 		 creator body string true "creator" example("did:snr:01234")
// @Param 		 label body string true "label" example("My Schema")
// @Param 		 schema_did body string true "schema_did" example("did:snr:01234")
// @Param 		 fields body string true "fields" example("did:snr:01234")
// @Success 	 200  {object}  rtmv1.UploadDocumentResponse
// @Failure      500  {object}  FailedResponse
// @Router /schema-document/create [post]
func (ns *NebulaServer) CreateSchemaDocument(c *gin.Context) {
	var body CreateSchemaDocumentRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}
	b := ns.Config.Binding

	schemadefinition, err := b.Instance.QueryWhatIs(rtmv1.QueryWhatIsRequest{
		Creator: body.Creator,
		Did:     body.SchemaDid,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	req := rtmv1.UploadDocumentRequest{
		Creator:    body.Creator,
		Label:      body.Label,
		Definition: schemadefinition.Schema,
		Fields:     body.Fields,
	}

	res, err := b.Instance.UploadDocument(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, rtmv1.UploadDocumentResponse{
		Status:   res.Status,
		Did:      res.Did,
		Cid:      res.Cid,
		Document: res.Document,
	})
}
