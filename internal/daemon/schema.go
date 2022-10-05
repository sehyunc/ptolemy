package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateSchema(req rtmv1.CreateSchemaRequest, res *rtmv1.CreateSchemaResponse) (err error) {
	*res, err = d.instance.CreateSchema(req)
	return
}

func (d *Daemon) GetSchema(req rtmv1.QueryWhatIsRequest, res *rtmv1.QueryWhatIsResponse) (err error) {
	*res, err = d.instance.GetSchema(req)
	return
}

func (d *Daemon) GetSchemaByCreator(req rtmv1.QueryWhatIsByCreatorRequest, res *rtmv1.QueryWhatIsByCreatorResponse) (err error) {
	res, err = d.instance.Instance.QueryWhatIsByCreator(req)
	return
}

func (d *Daemon) CreateSchemaDocument(req rtmv1.UploadDocumentRequest, res *rtmv1.UploadDocumentResponse) (err error) {
	*res, err = d.instance.CreateSchemaDocument(req)
	return
}

func (d *Daemon) GetSchemaDocument(req rtmv1.GetDocumentRequest, res *rtmv1.GetDocumentResponse) (err error) {
	*res, err = d.instance.GetSchemaDocument(req)
	return
}
