import DonutChart from "./DonutChart"

export default function MovieTile(props) {
    const className = props.className
    const title = props.title
    const score = props.score
    const index = props.index
    const x = props.x
    const y = props.y
    const width = props.width
    const height = props.height
    const fill = props.fill

    const onMouseEnter = props.onMouseEnter
    const onMouseLeave = props.onMouseLeave
    const onClick = props.onClick

    const titleClassName = 'title'
    const scoreClassName = 'score'
    const panelClassName = 'panel'

    return <g
        id={'movie-tile-' + index}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseEnter}
    >
        <rect className={panelClassName} x={x} y={y} width={width} height={height} fill={fill} />
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