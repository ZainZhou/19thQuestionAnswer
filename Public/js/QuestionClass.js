/**
 * Created by Zain on 6/11/2017.
 */
function Choice(){
    this.multiple,
    this.qc,
    this.answer,
    this.question,
    this.selections,
    this.choices
}
Choice.prototype.init = function(multiple,qc,answer,question,selections,choices,type){
    this.multiple = multiple;
    this.qc = qc;
    this.answer = answer;
    this.question = question;
    this.selections = selections;
    this.choices = choices;
    this.type = type;
};
Choice.prototype.fill = function(){
  this.qc.html(this.question);
  for(var i = 0 ; i < this.choices.length ; i++){
      this.selections.eq(i).html(this.choices[i]);
  }
};
Choice.prototype.check = function(){
   var flag = this.selected == this.answer ?  true :  false;
    return flag
};

function TrueFlase(){
    this.question,
    this.qc,
    this.answer,
    this.selected,
    this.operator
}
TrueFlase.prototype.init = function(question,qc,answer,operator,type){
    this.question = question;
    this.qc = qc;
    this.answer = answer;
    this.operator = operator;
    this.type = type;
};
TrueFlase.prototype.check = function(){
  var flag = this.selected == this.answer ? true : false;
    return flag
};
TrueFlase.prototype.fill = function(){
  this.qc.html(this.question);
};

function FillBlank(){
        this.question,
        this.answer,
        this.selected,
        this.qc,
        this.selections,
        this.choices,
        this.type
}
FillBlank.prototype.init = function(question,answer,qc,selections,fills,operator,type){
    this.question = question;
    this.answer = answer;
    this.qc = qc;
    this.fills = fills;
    this.selections = selections;
    this.operator = operator;
    this.type = type;
    this.selected = '';
};
FillBlank.prototype.fill = function(){
    this.qc.html(this.question[0]);
    var str = '';
    for(var i = 0 ; i < this.answer.length ; i++){
        str += "<span class='fillbox'>"+this.answer[i]+"</span>";
    }
    str = this.qc.html()+str+this.question[1];
    this.qc.html(str);
    for(var i = 0 ; i < this.fills.length ; i++){
        this.selections.eq(i).html(this.fills[i]);
    }
};
FillBlank.prototype.check = function(){
  var flag = this.selected == this.answer ? true : false;
    return flag
};