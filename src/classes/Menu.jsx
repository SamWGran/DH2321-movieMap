
function SideMenu() {
    const budgetSlider = useMemo(() => {
        return <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            max={budgetLimits[1]}
            min={budgetLimits[0]}
            defaultValue={budgetLimits}
            onAfterChange={(e) => setBudgetRange(e) }
        />
    })
}
