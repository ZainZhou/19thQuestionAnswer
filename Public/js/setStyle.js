/**
 * Created by Zain on 5/11/2017.
 */
$(function(){
    var w = $(window).width();
    var questionContainer = $('.questionContainer');
    var TrueFalse = $('.TrueFalse');
    var FillBlank = $('.FillBlank');
    TrueFalse.css('height',w*0.504);
    FillBlank.css('height',w*0.504);
    questionContainer.css('height',w*0.58);
});