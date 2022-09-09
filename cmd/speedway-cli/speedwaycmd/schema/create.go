package schema

import (
	"context"
	"fmt"
	"strings"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapCreateSchemaCommand(ctx context.Context, logger *golog.Logger) (createSchemaCmd *cobra.Command) {
	createSchemaCmd = &cobra.Command{
		Use:   "create",
		Short: "Use: create",
		Long:  "Creates a Schema definition with either a provided file path. If no flags are provided data will be prompted for",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatalf(status.Error("Login Failed"))
				return
			}

			logger.Info("Creating schema...")

			var label string = ""
			var createSchemaRequest rtmv1.CreateSchemaRequest
			if label, err = cmd.Flags().GetString("label"); err == nil && label == "" {
				schemaPrompt := promptui.Prompt{
					Label: "Enter the Schema Label",
				}
				label, err = schemaPrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
				}
			}

			fields := make(map[string]types.SchemaKind)
			if path, err := cmd.Flags().GetString("file"); err == nil && path == "" {
				// Prompt the user for a list of label:field to create a schema
				// label:field is a comma separated string
				// e.g. "name:string,age:int"
				fieldsPrompt := promptui.Prompt{
					Label: "Enter a list (sperated by commas) of label:kind for the schema",
				}

				result, err := fieldsPrompt.Run()
				if err != nil {
					logger.Fatalf(status.Error("Command failed"), err)
					return
				}

				// Parse the result into a types.Schema
				for _, field := range strings.Split(result, ",") {
					fieldSplit := strings.Split(field, ":")
					if len(fieldSplit) != 2 {
						logger.Fatalf(status.Error("Invalid field format"), err)
						return
					}
					// take the second element of the split and convert it to a types.SchemaKind
					kind := utils.ConvertSchemaKind(fieldSplit[1])
					fields[fieldSplit[0]] = kind
					fmt.Println(fieldSplit[0], kind)
				}

				createSchemaRequest = rtmv1.CreateSchemaRequest{
					Label:  label,
					Fields: fields,
				}
			} else {
				createSchemaRequest, err = utils.LoadSchemaFieldDefinitionFromDisk(path)
				if err != nil {
					logger.Fatalf("Error while loading schema fields from disk %s", err)
				}
			}

			// create schema
			reqStr, _ := utils.MarshalJsonFmt(createSchemaRequest)
			logger.Debugf("Schema request: \n%s", reqStr)

			createSchemaResult, err := m.CreateSchema(createSchemaRequest)
			if err != nil {
				logger.Fatalf(status.Error("CreateSchema Error: "), err)
				return
			}
			logger.Info(status.Success("Create Schema Successful"))
			// desearialize the scehma result to get the schema did
			fmt.Printf(`
			🚀 WhatIs for Schema Broadcasted
			├── Creator: %s
			├── Cid: %s
			└── Did: %s
			`, createSchemaResult.WhatIs.Creator, createSchemaResult.WhatIs.Schema.Cid, createSchemaResult.WhatIs.Did)
		},
	}

	createSchemaCmd.PersistentFlags().String("file", "", "an absolute path to an object definition matching a provided schema")
	return
}
