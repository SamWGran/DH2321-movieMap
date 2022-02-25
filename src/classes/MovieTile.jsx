
export default function MovieTile(props) {
    const className = props.className
    const title = props.title
    const score = props.score
    const index = props.index
    const x = props.x
    const y = props.y
    const width = props.width
    const height = props.height
    const widthCutoff = props.width
    const heightCutoff = props.height
    const fill = props.fill

    const onSelected = props.onSelected
    const onShowDetails = props.onShowDetails
    const onHideDetails = props.onHideDetails
    
    const titleClassName = 'title'
    const scoreClassName = 'score'
    const panelClassName = 'panel'

    if (width < widthCutoff || height < heightCutoff) {
        return <></>
    }

    return <g
        id={'movie-tile-' + index}
        className={className}
        transform={`translate(${x}, ${y})`}
        onClick={(e) => onSelected ? onSelected(index) : undefined}
        onMouseEnter={(e) => onShowDetails ? onShowDetails(index) : undefined}
        onMouseLeave={(e) => onHideDetails ? onHideDetails(index) : undefined}
    >
        <rect className={panelClassName} width={width} height={height} fill={fill} />
        <text className={titleClassName} 
            transform={`translate(${6}, ${4})`}
            dominantBaseline='hanging'>
            <tspan x='0'>
                {title}
            </tspan>
            <tspan className={scoreClassName} x='0' dy='1.2em'>
                {score}
            </tspan>
        </text>
    </g>
}

MovieTile.defaultProps = {
    title: "",
    score: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    widthCutoff: 10,
    heightCutoff: 10,
    fill: "black",
}