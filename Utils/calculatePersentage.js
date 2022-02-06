const calculatePersentage = (watchedCount,totalCount)=>{
    let x = (watchedCount/totalCount)*100;
    return Math.round(x);
}

module.exports = {calculatePersentage}