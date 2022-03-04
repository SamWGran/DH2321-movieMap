import MovieTile from "./MovieTile"

export default function MovieGroup(props) {
    const className = props.className
    const title = props.title
    const x = props.x
    const y = props.y
    const width = props.width
    const height = props.height
    const members = props.members
  
    const onSelected = props.onSelected
    const onShowDetails = props.onShowDetails
    const onHideDetails = props.onHideDetails
    
    const titleClassName = 'title'
    const panelClassName = 'panel'
    const memberClassName = 'member'
    
    const htmlId = title.replaceAll("[^a-zA-Z0-9]", "-").toLowerCase();

    return <g 
        className={className}
        id={'movie-group-'+htmlId}
    >
        <rect 
            className={panelClassName} 
            x={x} 
            y= {y} 
            width={width} 
            height={height} 
            fillOpacity='50%' 
        />
        <text
            className={titleClassName} 
            x={x+6} 
            y={y+8}
            dominantBaseline='hanging'
        >{title}</text>
        <g id={htmlId+'-movies'}>
            {members.map(member => {
                return <MovieTile
                    className={memberClassName}
                    key={member.id}
                    title={member.title}
                    score={member.score}
                    index={member.index}
                    x={member.x}
                    y={member.y}
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
    members: [],
}