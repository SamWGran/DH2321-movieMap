import '../styles/moviemapStyles.css'
import * as d3 from 'd3'
import {Slider, Box, Grid, Typography} from '@mui/material';
import React, {useMemo, useState} from 'react'

function formatDollars(amount) {
    const amountDiv = amount/1000000
    if (amountDiv < 1) {
        return '$' + (amountDiv*1000).toFixed(0).toString() + 'k'
    } else if (amountDiv < 1000) {
        return '$' + amountDiv.toFixed(1).toString() + 'm'
    } else {
        return '$' + amountDiv.toFixed(0).toString() + 'm'
    }
}

export default function Menu({
    budgetMin, 
    budgetMax, 
    onBudgetChange,
}) {
    const [budgetValue, setBudgetValue] = useState([budgetMin, budgetMax])
    const budgetSlider = useMemo(() => (
        <Slider
            disableSwap
            getAriaLabel={(i)=>'Budget'}
            getAriaValueText={(value) => formatDollars(value)}
            step={1000}
            max={budgetMax}
            min={budgetMin}
            value={[budgetValue[0], budgetValue[1]]}
            onChange={(e, values) => {setBudgetValue(values)}}
            onChangeCommitted={(e, values) => { 
                console.log('budget', values); 
                onBudgetChange(values[0], values[1])
            }}
        />
    ), [budgetMin, budgetMax, budgetValue, onBudgetChange])
    return (
        <Box sx={{ width: 400 }}>
            <Typography id="budget-slider" gutterBottom>
              Budget
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <Typography align='left'>{`${formatDollars(budgetValue[0])}`}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography align='right'>{`${formatDollars(budgetValue[1])}`}</Typography>
                </Grid>

                <Grid item xs={12}>
                    {budgetSlider}
                </Grid>

            </Grid>
      </Box>
    )
}
