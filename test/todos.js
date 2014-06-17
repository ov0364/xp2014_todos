describe("As a user I want to manage my todos so that i can achieve more in my life.", function(){

    beforeEach(function(done){
        //when opening the app
        open(done);
    });
    
    afterEach(function(){
        //Given no app
        close();
    });
    
    it("should open the app", function(){

        //then the title is shown
        expect($('h1').text()).toEqual('todos');
        //and the list empty
        expect($('ul').html()).toEqual('');
    }); 

    it("should add an item", function(){
//    when adding "Rule the web"
        $('input').val('Rule the web');
        $('form').submit();
//    then "Rule the web" is in the list
        expect($('ul li').text()).toEqual("Rule the web");
    });
});

