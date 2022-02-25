import MovieTile from "./MovieTile"

export default function MovieGroup(props) {
    const className = props.className
    const title = props.title
    const x = props.x
    const y = props.y
    const width = props.width
    const height = props.height
    const widthCutoff = props.width
    const heightCutoff = props.height
    const members = props.members
  
    const onSelected = props.onSelected
    const onShowDetails = props.onShowDetails
    const onHideDetails = props.onHideDetails
    
    const titleClassName = 'title'
    const panelClassName = 'panel'
    const memberClassName = 'member'
    
    const htmlId = title.replaceAll("[^a-zA-Z0-9]", "-").toLowerCase();
    
    if (width < widthCutoff || height < heightCutoff) {
        return <></>
    }
  
    return <g 
        className={className}
        id={'movie-group-'+htmlId}
        transform={`translate(${x}, ${y})`}
    >
        <rect className={panelClassName} width={width} height={height} fillOpacity='50%' />
        <text 
            className={titleClassName} 
            transform={`translate(${6}, ${4})`}
            dominantBaseline='hanging'

            id='movie-group-title'
        >{title}</text>
        <g id={htmlId+'-movies'}>
            {members.map(member => {
                return <MovieTile
                    className={memberClassName}
                    key={member.id}
                    title={member.title}
                    score={member.score}
                    index={member.index}
                    x={member.x-x}
                    y={member.y-y}
                    width={member.width}
                    height={member.height}
                    fill={member.fill}
                    onSelected={onSelected}
                    onShowDetails={onShowDetails}
                    onHideDetails={onHideDetails}
                />
            })}
        </g>
    </g>
}
  
MovieGroup.defaultProps = {
    title: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    widthCutoff: 10,
    heightCutoff: 10,
    members: [],
}