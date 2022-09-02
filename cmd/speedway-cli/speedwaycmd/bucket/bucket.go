package bucket

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

func BootstrapBucketCommand(ctx context.Context, logger *golog.Logger) (bucketCmd *cobra.Command) {
	bucketCmd = &cobra.Command{
		Use:   "bucket",
		Short: "Commands for managing and querying buckets",
		Long:  "Create and query buckets created by your user.",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Buckets] ")
	bucketCmd.AddCommand(bootstrapCreateBucketCommand(ctx, logger))
	bucketCmd.AddCommand(bootstrapQueryCommand(ctx, logger))
	bucketCmd.AddCommand(bootstrapSearchCommand(ctx, logger))
	return
}
