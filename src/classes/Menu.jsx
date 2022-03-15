import '../styles/moviemapStyles.css'
import * as d3 from 'd3'
import {Slider, Box, Grid, Typography} from '@mui/material';
import React, {useMemo, useState} from 'react'
import formatDollars from './formatDollars';

export default function Menu({
    movies,
    onBudgetChange,
    onRevenueChange,
    onProfitChange,
    onRoiChange,
}) {
    const [roiTick, setRoiTick] = useState([0, movies.length-1])
    const [budgetTick, setBudgetTick] = useState([0, movies.length-1])
    const [profitTick, setProfitTick] = useState([0, movies.length-1])
    const [revenueTick, setRevenueTick] = useState([0, movies.length-1])
    

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
                    {formatDollars(rois[roiTick[0]])}
                </Typography>
            ) 
            const textRight = (
                <Typography align='right'>
                    {formatDollars(rois[roiTick[1]])}
                </Typography>
            )
            const header = (
                <Typography id="roi-slider" gutterBottom>
                    Roi
                </Typography>
            )
            return (
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>{header}</Grid>
                    <Grid item xs={6}>{textLeft}</Grid>
                    <Grid item xs={6}>{textRight}</Grid>
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
                <Typography id="budget-slider" gutterBottom>
                    Budget
                </Typography>
            )
            return (
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>{header}</Grid>
                    <Grid item xs={6}>{textLeft}</Grid>
                    <Grid item xs={6}>{textRight}</Grid>
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
                <Typography id="profit-slider" gutterBottom>
                    Profit
                </Typography>
            )
            return (
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>{header}</Grid>
                    <Grid item xs={6}>{textLeft}</Grid>
                    <Grid item xs={6}>{textRight}</Grid>
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
                <Typography id="revenue-slider" gutterBottom>
                    Revenue
                </Typography>
            )
            return (
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>{header}</Grid>
                    <Grid item xs={6}>{textLeft}</Grid>
                    <Grid item xs={6}>{textRight}</Grid>
                    <Grid item xs={12}>{slider}</Grid>
                </Grid>
            )
        }, 
        [movies, revenueTick]
    )

    const sliders = (
        <Box bgcolor="mediumaquamarine" color="white">
            <Box sx={{m:4, width: "392px" }}>
                {budgetSlider}
                {revenueSlider}
                {profitSlider}
                {roiSlider}
            </Box> 
        </Box>
    )

    return sliders
}

/*

            <Typography id="revenue-slider" gutterBottom>Revenue</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <Typography align='left'>{`${formatDollars(revenueValue[0])}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='right'>{`${formatDollars(revenueValue[1])}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {revenueSlider}
                </Grid>
            </Grid>

            <Typography id="profit-slider" gutterBottom>Profit</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <Typography align='left'>{`${formatDollars(profitValue[0])}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='right'>{`${formatDollars(profitValue[1])}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {profitSlider}
                </Grid>
            </Grid>

            <Typography id="roi-slider" gutterBottom>Return on Investment</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <Typography align='left'>{`${(roiValue[0]*100).toFixed(0)} %`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='right'>{`${(roiValue[1]*100).toFixed(0)} %`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {roiSlider}
                </Grid>
            </Grid>
*/