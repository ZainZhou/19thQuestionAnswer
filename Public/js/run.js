/**
 * Created by Zain on 6/11/2017.
 */

var questionLink = "/19thQuestionAnswer/index.php/Home/Index/getQustion";
var answerLink = "/19thQuestionAnswer/index.php/Home/Index/answer";
function fillQuestion(data,qc,ops,ops_sell){
    switch(data.type){
        case 'judge':
            var q = new TrueFlase();
            q.init(data.question,qc,data.isTrue,ops[0],data.type);
            q.fill();
            q.operator.css('display','block');
            return q;
        case 'fillblank':
            var q = new FillBlank();
            q.init(data.question,data.answer,qc,ops_sell[1],data.fill,ops[1],data.type);
            q.operator.css('display','block');
            q.fill();
            return q;
    }
}
$(function(){
    var startBtn = $('.startBtn');
    var start_flag = false;
    var apply_flag = false;
    var qc = $('.questionContainer');
    var operators = [$('.TrueFalse'),$('.FillBlank'),$('.Choice')];
    var q_now = null;
    var judge_btn = operators[0].find('.selection');
    var fill_sell = $('.FillSelections').find('li');
    var apply_btn = $('.applyBtn');
    var current = 1;
    var ops_sell = ['',fill_sell,$('.selections').find('.selection')];
    var fill_flag = 0;
    var fill_box = null;
    startBtn.on('click',function(){
        if(start_flag){
            return false
        }
        start_flag = true;
        $.mobile.loading('show');
        $.post(questionLink,"",function(data){
            start_flag = false;
            $.mobile.loading('hide');
            if(data.status == 200){
                console.log(data.data);
                q_now = fillQuestion(data.data,qc,operators,ops_sell);
                if(q_now.type == 'fillblank'){
                    fill_box = $('.fillbox');
                }
                current = data.current;
                $.mobile.changePage('#testPage',{
                    transition:'flow'
                });
            }
        })
    });
    judge_btn.on('click',function(){
        q_now.selected = $(this).attr('dec');
        judge_btn.css('background','#fea087');
        $(this).css('background','#ffffff');
    });
    fill_sell.on('click',function(){
        fill_flag += 1;
        if(fill_flag > q_now.answer.length){
            return false;
        }
        $(this).css({'background':'#fea087','color':'#ffffff'});
        fill_box.eq(fill_flag-1).html($(this).html());
        q_now.selected += $(this).html();
        fill_box.eq(fill_flag-1).css('color','#fb5d32');
    });
    apply_btn.on('click',function(){
            fill_flag = 0;
            if(apply_flag){
                return false;
            }
            fill_sell.css({'background':'#ffffff','color':'#f88364'});
            judge_btn.css('background','#fea087');
            apply_flag = true;
            var isRight = q_now.check();
            $.mobile.loading('show');
            var _data = {};
            _data.time = 10;
            _data.isCorrect = isRight;
            $.post(answerLink,_data,function(data){
                if(data.status != 200){
                    alert(data.error);
                }
            });
            if(current != 5){
                var _data = {};
                _data.new = true;
                $.post(questionLink,_data,function(data){
                    apply_flag = false;
                    $.mobile.loading('hide');
                    if(data.status == 200){
                        console.log(data.data);
                        q_now = fillQuestion(data.data,qc,operators,ops_sell);
                        if(q_now.type == 'fillblank'){
                            fill_box = $('.fillbox');
                        }
                        current = data.current;
                    }else{
                        alert(data.error)
                    }
                });
            }else{
                apply_flag = false;
                $.mobile.loading('hide');
            }
    })
});