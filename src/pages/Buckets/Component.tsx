import { useContext } from "react"
import timeAgo from "node-time-ago"

import LoadingCircleSvg from "../../assets/svgs/LoadingCircle"
import EmptyList from "../../components/EmptyList"
import LayoutMenu from "../../components/LayoutMenu"
import {
  AppModalContext,
  IappModalContextState,
} from "../../contexts/appModalContext/appModalContext"
import { MODAL_CONTENT_NEW_BUCKET } from "../../utils/constants"
import { Bucket } from "../../utils/types"

type Props = {
  data: Bucket[]
  loading: boolean
}

const BucketsPageComponent = ({ data, loading }: Props) => {
  const { setModalContent, openModal } =
    useContext<IappModalContextState>(AppModalContext)
  const openNewBucketModal = () => {
    setModalContent({ content: MODAL_CONTENT_NEW_BUCKET })
    openModal()
  }

  return (
    <LayoutMenu>
      <div className="py-14 px-10">
        <div className="flex flex-row gap-2">
          <h1 className="flex-1 text-custom-3xl tracking-custom-x2tighter font-extrabold text-default">
            Buckets
          </h1>

          {!loading && (
            <button
              className="self-center text-skin-primary bg-skin-primary font-extrabold rounded py-2 px-6"
              onClick={openNewBucketModal}
            >
              Create Bucket
            </button>
          )}
        </div>

        {loading && (
          <div className="w-full flex justify-center mt-20">
            <div className="w-28 animate-spin flex justify-center items-center">
              <LoadingCircleSvg />
            </div>
          </div>
        )}

        {!loading && (
          <>
            {!data.length && <EmptyList message="No Buckets to Display" />}

            {!!data.length && (
              <div className="flex flex-wrap gap-6 mt-8">
                {data.map(BucketCard)}
              </div>
            )}
          </>
        )}
      </div>
    </LayoutMenu>
  )
}
export default BucketsPageComponent

const BucketCard = (bucket: Bucket) => (
  <div
    className="bg-white rounded-2xl w-[330px] shadow-xxl p-6 text-default"
    key={bucket.did}
  >
    <h2 className="font-extrabold text-custom-lg whitespace-nowrap overflow-hidden text-ellipsis mb-6">
      {bucket.label}
    </h2>

    <div className="flex mb-6">
      <div className="border rounded-md text-custom-xs">
        <span className="px-[6px] py-[2px] border-r rounded-tr-md text-subdued">
          Objects
        </span>

        <span className="px-[6px] py-[2px] font-extrabold">
          {bucket.content.length}
        </span>
      </div>
    </div>

    <div className="font-extrabold text-placeholder text-custom-xxs">
      Last Update: {timeAgo(parseInt(bucket.timestamp) * 1000)}
    </div>
  </div>
)
