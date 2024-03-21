import Breadcrumbs from "@mui/material/Breadcrumbs";

export default function BreadCrums(props:{breadcrumbs:any}){
    const {breadcrumbs} = props
    return (
        <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
    )
}