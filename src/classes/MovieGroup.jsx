import MovieTile from "./MovieTile"

export default function MovieGroup(props) {
    const className = props.className
    const title = props.title
    const x = props.x
    const y = props.y
    const width = props.width
    const height = props.height
    const members = props.members
  
    const onMouseEnter = props.onMouseEnter
    const onMouseLeave = props.onMouseLeave
    
    const titleClassName = 'title'
    const panelClassName = 'panel'
    const memberClassName = 'member'
    
    const htmlId = title.replaceAll("[^a-zA-Z0-9]", "-").toLowerCase();

    const panel = <rect 
        className={panelClassName} 
        x={x} 
        y= {y} 
        width={width} 
        height={height} 
        fillOpacity='50%' 
    />

    const text = <text
        className={titleClassName} 
        x={x+6} 
        y={y+8}
        dominantBaseline='hanging'
    >{title}</text>
    
    const tiles = members.map(member => <MovieTile
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
        onMouseEnter={member.onMouseEnter}
        onMouseLeave={member.onMouseLeave}
    />)

    return <g 
        className={className} 
        id={'movie-group-'+htmlId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        {panel}
        {text}
        <g id={htmlId+'-movies'}>{tiles}</g>
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