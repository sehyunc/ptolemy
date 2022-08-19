package binding

import (
	"context"
	"fmt"
	"sync"

	"github.com/sonr-io/sonr/pkg/did"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/sonr-io/sonr/pkg/motor/x/object"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/sonr-io/speedway/internal/utils"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

var (
	ErrMotorNotInitialized = fmt.Errorf("cannot find instance of motor")
	ErrNotAuthenticated    = fmt.Errorf("must be logged in to preform that action")
	ErrMotorFailedInit     = fmt.Errorf("motor failed to initialize")
)

type SpeedwayBinding struct {
	loggedIn bool
	instance mtr.MotorNode
}

var binding *SpeedwayBinding
var once sync.Once

/*
Initialize the speedway binding to the motor
*/
func InitMotor() mtr.MotorNode {
	fmt.Println(status.Debug, "Initializing motor...")

	hwid := utils.GetHwid()
	m := mtr.EmptyMotor(hwid)
	if m == nil {
		fmt.Println(status.Error, ErrMotorFailedInit)
		return nil
	}

	fmt.Println(status.Debug, "Motor initialized", m)

	return m
}

/*
Here each function matches a function on the MotorNode for functionality being exposed to the cli and rest server there should be a wrapper function definedon the SpeedwayMotorBindingSruct.
*/
func CreateInstance() *SpeedwayBinding {
	once.Do(func() {
		binding = &SpeedwayBinding{}
		m := InitMotor()
		binding.instance = m
	})
	return binding
}

/*
Get the Instance of the motor node and return it
*/
func GetInstance() (*SpeedwayBinding, error) {
	if binding.instance == nil {
		return nil, ErrMotorNotInitialized
	}

	return binding, ErrMotorNotInitialized
}

/*
Create Account on Blockchain and return the response
*/
func (b *SpeedwayBinding) CreateAccount(req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	res, err := b.instance.CreateAccount(req)
	if err != nil {
		fmt.Println(status.Error, "Create Account Error", err)
	}

	if storage.Store("psk.key", res.AesPsk) != nil {
		fmt.Println(status.Error, "Storage Error: ", err)
	}

	if storage.StoreInfo("address.snr", b.instance) != nil {
		fmt.Println(status.Error, "Storage Error: ", err)
	}

	return res, err
}

/*
Login and return the response
Set the logged in flag to true if successful
*/
func (b *SpeedwayBinding) Login(req rtmv1.LoginRequest) (rtmv1.LoginResponse, error) {
	if b.instance == nil {
		return rtmv1.LoginResponse{}, ErrMotorNotInitialized
	}

	res, err := b.instance.Login(req)
	if err != nil {
		fmt.Println(status.Error, "Login Error", err)
	}

	b.loggedIn = true

	return res, err
}

/*
Get the object and return a map of the object
*/
func (b *SpeedwayBinding) GetObject(ctx context.Context, schemaDid string, cid string) (map[string]interface{}, error) {
	if b.instance == nil {
		return map[string]interface{}{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return map[string]interface{}{}, ErrNotAuthenticated
	}

	// Create new QueryWhatIs request for the object
	querySchema, err := b.instance.QueryWhatIs(ctx, rtmv1.QueryWhatIsRequest{
		Creator: b.instance.GetDID().String(),
		Did:     schemaDid,
	})
	if err != nil {
		fmt.Println(status.Error, ("Error"), err)
		return nil, err
	}
	fmt.Printf("%v\n", querySchema.WhatIs)

	// Start a NewObjectBuilder (so we can call the GetByCID method)
	objBuilder, err := b.instance.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Println(status.Error, ("Error"), err)
		return nil, err
	}

	// Get the object by CID
	getObject, err := objBuilder.GetByCID(cid)
	if err != nil {
		fmt.Println(status.Error, ("Error"), err)
		return nil, err
	}

	return getObject, nil
}

/*
Get the schema and return the WhatIsResponse
*/
func (b *SpeedwayBinding) GetSchema(ctx context.Context, creator string, schemaDid string) (rtmv1.QueryWhatIsResponse, error) {
	if b.instance == nil {
		return rtmv1.QueryWhatIsResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.QueryWhatIsResponse{}, ErrNotAuthenticated
	}

	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: creator,
		Did:     schemaDid,
	}

	// query schema
	querySchemaRes, err := b.instance.QueryWhatIs(ctx, querySchemaReq)
	if err != nil {
		fmt.Printf("Binding failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return querySchemaRes, nil
}

/*
Create the schema and return the WhatIsResponse
*/
func (b *SpeedwayBinding) CreateSchema(req rtmv1.CreateSchemaRequest) (rtmv1.CreateSchemaResponse, error) {
	if b.instance == nil {
		return rtmv1.CreateSchemaResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.CreateSchemaResponse{}, ErrNotAuthenticated
	}

	res, err := b.instance.CreateSchema(req)
	if err != nil {
		fmt.Printf("Binding failed %v\n", err)
		return rtmv1.CreateSchemaResponse{}, err
	}

	return res, nil
}

/*
NewObjectBuilder and return the ObjectBuilder
*/
func (b *SpeedwayBinding) NewObjectBuilder(schemaDid string) (*object.ObjectBuilder, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	objBuilder, err := b.instance.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Printf("Binding failed %v\n", err)
		return nil, err
	}

	return objBuilder, nil
}

/*
QueryWhatIs and return the WhatIsResponse
*/
func (b *SpeedwayBinding) QueryWhatIs(ctx context.Context, req rtmv1.QueryWhatIsRequest) (rtmv1.QueryWhatIsResponse, error) {
	if b.instance == nil {
		return rtmv1.QueryWhatIsResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.QueryWhatIsResponse{}, ErrNotAuthenticated
	}

	querySchema, err := b.instance.QueryWhatIs(ctx, req)
	if err != nil {
		fmt.Println(status.Error, "Binding failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return querySchema, nil
}

/*
GetDID and return the DID
*/
func (b *SpeedwayBinding) GetDID() (*did.DID, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}

	did := b.instance.GetDID()
	return &did, nil
}

/*
GetDidDocument and return the DidDocument
*/
func (b *SpeedwayBinding) GetDidDocument() (*did.Document, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	didDoc := b.instance.GetDIDDocument()
	if didDoc == nil {
		return nil, ErrNotAuthenticated
	}

	return &didDoc, nil
}

/*
GetAddress and return the address
*/
func (b *SpeedwayBinding) GetAddress() (string, error) {
	if b.instance == nil {
		return "", ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return "", ErrNotAuthenticated
	}

	address := b.instance.GetAddress()
	if address == "" {
		return "", ErrNotAuthenticated
	}

	return address, nil
}
