import '../styles/moviemapStyles.css'
import * as d3 from 'd3'
import {Slider, Box, Grid, Typography, Checkbox, FormControlLabel, Stack} from '@mui/material';
import React, {useMemo, useState} from 'react'
import Legend from './Legend'
import formatDollars from './formatDollars';

function makeGroups(data, groupKey) {
    const nameOf = x => x.name ? x.name : x
    const membership = data.map(m => [m[groupKey]].flat().map(nameOf))
    const groups = data.flatMap((_, i) => membership[i])
    let groups2 = [];
    groups.forEach(g => {
        if (!groups2.includes(g)) {
            groups2.push(g)
        } 
    })
    groups2.sort((a, b) => b<a?1:-1)
    return groups2
}

export default function Menu({
    movies,
    groupKey,
    onBudgetChange,
    onRevenueChange,
    onProfitChange,
    onRoiChange,
    onHide,
    onShow,
    hidden,
}) {
    const [roiTick, setRoiTick] = useState([0, movies.length-1])
    const [budgetTick, setBudgetTick] = useState([0, movies.length-1])
    const [profitTick, setProfitTick] = useState([0, movies.length-1])
    const [revenueTick, setRevenueTick] = useState([0, movies.length-1])

    const buttons = useMemo(() => {
            const groups = makeGroups(movies, groupKey);
            const checkboxStyleOverrides = {
                padding: '10px', 
                boxSizing: 'border-box', 
                border: '2px solid #202020', 
                height: 'auto', 
                overflowX: 'hidden', 
                overflowY: 'auto'
            }
            return <div style={checkboxStyleOverrides}>
                <Grid container spacing={0} alignItems="left">
                {groups.map(g => <Grid item xs={6}>
                    <FormControlLabel
                    label={g=='Science Fiction' ? 'Sci-Fi' : g}
                    control={<Checkbox
                        sx={{pt:0, pb:0}}
                        key={g}
                        checked={!hidden.includes(g)}
                        onChange={
                            (event) => {if (event.target.checked) { onShow(g) } else { onHide(g) }}
                        }
                    />}
                    />
                </Grid>
                )}
                </Grid>
            </div>
        },
        [hidden, movies, groupKey]
    )

    console.log(buttons)

    const roiSlider = useMemo(
        () => {
            const marks = movies.map((_, i) => i)
            const rois = movies.map(m => m.roi)
            rois.sort((x, y) => y-x);
            rois.reverse()
            const m2b = d3.scaleOrdinal(marks, rois)
            const onChange = (_, v) => setRoiTick(v)
            const onChangeCommitted = (_, v) => onRoiChange(m2b(v[0]), m2b(v[1]))
            const slider = (
                <Slider
                    disableSwap
                    step={1}
                    min={0}
                    max={movies.length-1}
                    value={roiTick}
                    onChange={onChange}
                    onChangeCommitted={onChangeCommitted}
                />
            )
            const textLeft = (
                <Typography align='left'>
                    {(rois[roiTick[0]]*100-100).toFixed(0)+'%'}
                </Typography>
            ) 
            const textRight = (
                <Typography align='right'>
                    {(rois[roiTick[1]]*100-100).toFixed(0)+'%'}
                </Typography>
            )
            const header = (
                <Typography id="roi-slider" align='center' gutterBottom>
                    Return on Investment
                </Typography>
            )
            return (
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>{textLeft}</Grid>
                    <Grid item xs={4}>{header}</Grid>
                    <Grid item xs={4}>{textRight}</Grid>
                    <Grid item xs={12}>{slider}</Grid>
                </Grid>
            )
        }, 
        [movies, roiTick]
    )

    const budgetSlider = useMemo(
        () => {
            const marks = movies.map((_, i) => i)
            const budgets = movies.map(m => m.budget)
            budgets.sort((x, y) => y-x);
            budgets.reverse()
            const m2b = d3.scaleOrdinal(marks, budgets)
            const onChange = (_, v) => setBudgetTick(v)
            const onChangeCommitted = (_, v) => onBudgetChange(m2b(v[0]), m2b(v[1]))
            const slider = (
                <Slider
                    disableSwap
                    step={1}
                    min={0}
                    max={movies.length-1}
                    value={budgetTick}
                    onChange={onChange}
                    onChangeCommitted={onChangeCommitted}
                />
            )
            const textLeft = (
                <Typography align='left'>
                    {formatDollars(budgets[budgetTick[0]])}
                </Typography>
            ) 
            const textRight = (
                <Typography align='right'>
                    {formatDollars(budgets[budgetTick[1]])}
                </Typography>
            )
            const header = (
                <Typography id="budget-slider" align='center' gutterBottom>
                    Budget
                </Typography>
            )
            return (
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>{textLeft}</Grid>
                    <Grid item xs={4}>{header}</Grid>
                    <Grid item xs={4}>{textRight}</Grid>
                    <Grid item xs={12}>{slider}</Grid>
                </Grid>
            )
        }, 
        [movies, budgetTick]
    )

    const profitSlider = useMemo(
        () => {
            const marks = movies.map((_, i) => i)
            const profits = movies.map(m => m.profit)
            profits.sort((x, y) => y-x);
            profits.reverse()
            const m2b = d3.scaleOrdinal(marks, profits)
            const onChange = (_, v) => setProfitTick(v)
            const onChangeCommitted = (_, v) => onProfitChange(m2b(v[0]), m2b(v[1]))
            const slider = (
                <Slider
                    disableSwap
                    step={1}
                    min={0}
                    max={movies.length-1}
                    value={profitTick}
                    onChange={onChange}
                    onChangeCommitted={onChangeCommitted}
                />
            )
            const textLeft = (
                <Typography align='left'>
                    {formatDollars(profits[profitTick[0]])}
                </Typography>
            ) 
            const textRight = (
                <Typography align='right'>
                    {formatDollars(profits[profitTick[1]])}
                </Typography>
            )
            const header = (
                <Typography id="profit-slider" align='center' gutterBottom>
                    Profit
                </Typography>
            )
            return (
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>{textLeft}</Grid>
                    <Grid item xs={4}>{header}</Grid>
                    <Grid item xs={4}>{textRight}</Grid>
                    <Grid item xs={12}>{slider}</Grid>
                </Grid>
            )
        }, 
        [movies, profitTick]
    )

    const revenueSlider = useMemo(
        () => {
            const marks = movies.map((_, i) => i)
            const revenues = movies.map(m => m.revenue)
            revenues.sort((x, y) => y-x);
            revenues.reverse()
            const m2b = d3.scaleOrdinal(marks, revenues)
            const onChange = (_, v) => setRevenueTick(v)
            const onChangeCommitted = (_, v) => onRevenueChange(m2b(v[0]), m2b(v[1]))
            const slider = (
                <Slider
                    disableSwap
                    step={1}
                    min={0}
                    max={movies.length-1}
                    value={revenueTick}
                    onChange={onChange}
                    onChangeCommitted={onChangeCommitted}
                />
            )
            const textLeft = (
                <Typography align='left'>
                    {formatDollars(revenues[revenueTick[0]])}
                </Typography>
            ) 
            const textRight = (
                <Typography align='right'>
                    {formatDollars(revenues[revenueTick[1]])}
                </Typography>
            )
            const header = (
                <Typography id="revenue-slider" align='center' gutterBottom>
                    Revenue
                </Typography>
            )
            return (
                <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>{textLeft}</Grid>
                    <Grid item xs={4}>{header}</Grid>
                    <Grid item xs={4}>{textRight}</Grid>
                    <Grid item xs={12}>{slider}</Grid>
                </Grid>
            )
        }, 
        [movies, revenueTick]
    )

    const legend = (
		<Legend
			height={window.innerHeight}
		/>
	)
    const sliderStyleOverride = {
        paddingTop: '10px', 
        paddingLeft: '20px', 
        paddingRight: '20px',
        margin: '3px',
        width: '100%',
        boxSizing: 'border-box', 
        border: '2px solid #202020',
    }
    const sliders = (
        <Box sx={{m:2}}>
            <a style={{textAlign:'center', fontSize:'0.8rem', display:'block', border:'2px solid #202020', textDecoration:'none'}} href="#" onClick={()=>{window.location.reload()}}>Reset All</a>
            <Stack alignItems='center' spacing={1} color="white">
                <div style={sliderStyleOverride}>
                    {budgetSlider}
                </div>
                <div style={sliderStyleOverride}>
                    {revenueSlider}
                </div>
                <div style={sliderStyleOverride}>
                    {profitSlider}
                </div>
                <div style={sliderStyleOverride}>
                    {roiSlider}
                </div>
                {buttons}
                {legend}
            </Stack>
        </Box>
    )

    return sliders
}
