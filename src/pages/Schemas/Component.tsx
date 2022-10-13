import LoadingCircleSvg from "../../assets/svgs/LoadingCircle"
import EmptyList from "../../components/EmptyList"
import LayoutMenu from "../../components/LayoutMenu"
import SearchableList from "../../components/SearchableList"
import { SearchableListType, ListTypes } from "../../utils/types"
import { Button } from "@sonr-io/nebula-react"

interface SchemasPageComponentProps {
	list: SearchableListType
	searchableAndSortableFieldKey: string
	openNewSchemaModal: () => void
	loading: boolean
}

function SchemasPageComponent({
	list,
	searchableAndSortableFieldKey,
	openNewSchemaModal,
	loading,
}: SchemasPageComponentProps) {
	return (
		<LayoutMenu>
			<div className="py-14 px-10">
				<h1 className="text-custom-3xl tracking-custom-x2tighter font-extrabold text-default mb-8">
					Schemas
				</h1>

				{loading && (
					<div className="w-full flex justify-center mt-20">
						<div className="w-28 animate-spin flex justify-center items-center">
							<LoadingCircleSvg />
						</div>
					</div>
				)}

				{!loading &&
					(list.length > 0 ? (
						<SearchableList
							searchableAndSortableFieldKey={searchableAndSortableFieldKey}
							handleOpenModal={openNewSchemaModal}
							initialList={list}
							type={ListTypes.schema}
							loading={loading}
						/>
					) : (
						<EmptyList
							message="No Schemas to Display"
							cta={
								<Button
									styling="text-custom-md font-extrabold tracking-custom-tight px-6 py-1.5 h-auto"
									onClick={openNewSchemaModal}
									iconName="Add"
									iconType="outline"
									label="Create New Schema"
								/>
							}
						/>
					))}
			</div>
		</LayoutMenu>
	)
}

export default SchemasPageComponent
