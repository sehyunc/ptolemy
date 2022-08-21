package schema

import (
	"context"

	"github.com/spf13/cobra"
)

func BootstrapSchemaCommand(ctx context.Context) (schemaCmd *cobra.Command) {
	schemaCmd = &cobra.Command{
		Use:   "schema",
		Short: "Provides commands for managing schemas on the Sonr Network",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	schemaCmd.AddCommand(bootstrapCreateSchemaCommand(ctx))
	schemaCmd.AddCommand(bootstrapQuerySchemaCommand(ctx))
	return
}
