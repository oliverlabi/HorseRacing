const BettingOddsPage = () => {
    return(
    <div>
        <h1>Betting odds</h1>
        <h3>How does betting work?</h3>
        <div style={{fontWeight:'normal'}}>
            <p>The more horses there are in the race, the lower odds you have of winning.</p>
            <p>After choosing a race and betting on it, you can check on the race after it has ended and upon winning you get a payout.</p>
            <p>You can only bet on one horse!</p>
        </div>
        <p>Odds:</p>
        <div style={{fontWeight:'normal'}}>
            <p>2 horses: 1/2 winning chance with double payout</p>
            <p>3 horses: 1/3 winning chance with triple payout</p>
            <p>4 horses: 1/4 winning chance with quad payout</p>
            <p>5 horses: 1/5 winning chance with penta payout</p>
            <p>6 horses: 1/3 winning chance with hexa payout</p>
        </div>
        <p>Do tracks affect the odds?</p>
        <div style={{fontWeight:'normal'}}>
            <p>Currently betting odds are not affected by race tracks.</p>
        </div>
        
    </div>
    )
}

export default BettingOddsPage;