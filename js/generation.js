let gen = document.getElementById('gen');
let num_min,num_max;
gen.addEventListener("change",function(){
    let selectValue=gen.value;
    if(selectValue === "primera"){
        num_min=1;
        num_max=151;
    } else if(selectValue =="segunda"){
        num_min=152;
        num_max=251;
    } else if(selectValue =="tercera"){
        num_min=252;
        num_max=386;
    }else if(selectValue =="cuarta"){
        num_min=387;
        num_max=493;
    }else if(selectValue =="quinta"){
        num_min=494;
        num_max=649;
    }else if(selectValue =="sexta"){
        num_min=650;
        num_max=721;
    }else if(selectValue =="septima"){
        num_min=722;
        num_max=809;
    }else{
        num_min=810;
        num_max=898;
    }
});

export {num_min,num_max,gen};
