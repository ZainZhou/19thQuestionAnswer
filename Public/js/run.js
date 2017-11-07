/**
 * Created by Zain on 6/11/2017.
 */

var questionLink = "/19thQuestionAnswer/index.php/Home/Index/getQuestion";
var answerLink = "/19thQuestionAnswer/index.php/Home/Index/answer";
var personalLink = "/19thQuestionAnswer/index.php/Home/Index/personal";
function fillQuestion(data,qc,ops,ops_sell){
    for(var i = 0 ; i < ops.length ; i++){
        ops[i].css('display','none');
    }
    switch(data.type){
        case 'judge':
            var q = new TrueFlase();
            q.init(data.question,qc,data.isTrue,ops[0],data.reason,data.type);
            q.fill();
            return q;
        case 'fillblank':
            var q = new FillBlank();
            q.init(data.question,data.answer,qc,ops_sell[1],data.fill,ops[1],data.type);
            q.fill();
            return q;
        case 'select':
            var q = new Choice();
            q.init(0,qc,data.answer,data.question,data.select,ops_sell[2],ops[2],data.type);
            q.fill();
            return q;
        case 'multiSelect':
            var q = new Choice();
            q.init(1,qc,data.answer,data.question,data.select,ops_sell[2],ops[2],data.type);
            q.fill();
            return q;
        default:
            alert('error!');
    }
}
$(function(){
    var startBtn = $('.startBtn');
    var start_flag = false;
    var apply_flag = false;
    var qc = $('.questionContainer');
    var operators = [$('.TrueFalse'),$('.FillBlank'),$('.MultipleChoice')];
    var q_now = null;
    var judge_btn = operators[0].find('.selection');
    var fill_sell = $('.FillSelections').find('li');
    var apply_btn = $('.applyBtn');
    var current = 1;
    var ops_sell = ['',fill_sell,$('.selections').find('.selection')];
    var fill_flag = 0;
    var fill_box = null;
    var chose_btn = $('.selections').find('li');
    var right_num = $('.right_num');
    var score_s = $('.score_s');
    var score_c = $('.score_c');
    var person_rank_num = $('.rank_num');
    var ReplayBtn = $('.ReplayBtn');
    var RankBtn = $('.RankBtn');
    ReplayBtn.on('click',function(){
        $.mobile.changePage('#homePage',{
            transition:'flow'
        })
    });
    RankBtn.on('click',function(){
        $.mobile.changePage('#rankPage',{
            transition:'flow'
        })
    });
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
    chose_btn.on('click',function(){
        q_now.selected += $(this).attr('data-flag');
        $(this).css('background','#ffffff');
        console.log(q_now.selected);
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
            chose_btn.css('background','#fea087');
            fill_sell.css({'background':'#ffffff','color':'#f88364'});
            judge_btn.css('background','#fea087');
            apply_flag = true;
            var isRight = q_now.check();
            $.mobile.loading('show');
            var _data = {};
            _data.isCorrect = isRight;
            $.post(answerLink,_data,function(data){
                if(data.status != 200){
                    alert(data.error);
                }
            });
            if(current < 5){
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
                $.get(personalLink,function(data){
                    if(data.status == 200){
                        right_num.html(data.data.correct);
                        score_s.html(data.data.last_score);
                        score_c.html(data.data.all_score);
                        person_rank_num.html(data.data.rank);
                        setTimeout(function(){
                            $.mobile.changePage('#overPage',{
                                transition:'flow'
                            })
                        },100)
                    }else{
                        alert(data.error);
                    }
                });
            }
    })
});