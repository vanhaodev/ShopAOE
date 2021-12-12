function level(exp){
    
    if(Math.trunc(((Math.sqrt(625+100 * exp)-25) / 1080)) > 1000){
        return 1000;
    }
    return Math.trunc(((Math.sqrt(625+100 * exp)-25) / 1080));
   
}

module.exports = level;
/*
function calculateLevel(experience) {
    return Math.trunc(((Math.sqrt(625+100 * experience)-25) / 1080));
}

function calculateExperience(level){
    return Math.trunc((Math.pow(1080 * level + 25, 2) - 625) / 100);
}


console.log("Level 100 need: " + calculateExperience(1000));
console.log("119.001.304 XP is Level: " + calculateLevel(11664540000));
*/