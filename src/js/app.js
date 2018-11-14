App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {
    $.getJSON('../real-estate.json', function(data){
      var list = $('#list');
      var template = $('#template');

      for (i = 0; i < data.length; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        list.append(template.html());
      }
    })
   
    return App.initWeb3();
  },

  // Web3 : 이더리움과 소통할 수 있게 해주는 라이브러리. - 스마트컨트랙과 연결할 수 있게 해줌.
  // 이를 인스턴스화 해서 쓸 수 있도록 설정한다. 
  initWeb3: function() {
    if(typeof web3 !== 'undefined') { 
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else { //metamask가 없을경우
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      // 새로운 web3 object를 가져옴.
      web3 = new Web3(App.web3Provider);
    }
    
    return App.initContract();
  },

  initContract: function() {
    // archfact 파일은 abi와 컨트랙주소를 가지고 있다.  - 배포 첫번째 강좌
    $.getJSON('RealEstate.json', function(data){
      // truffle library에서 data를 넘겨받아 트러플컨트랙에 넘겨서 인스턴스화 시킨다. 
      App.contracts.RealEstate = TruffleContract(data); //contract instance 화
      App.contracts.RealEstate.setProvider(App.web3Provider);
      //return App.loadRealEstates();
      App.listenToEvents();
    });
  },

  // 이쯤에서 controller 호출
  buyRealEstate: function() {
    // log 로 데이터 확인
    var id = $('#id').val();
    var name = $('#name').val();
    var price = $('#price').val();
    var age = $('#age').val();

    // console.log(id);
    // console.log(price);
    // console.log(name);
    // console.log(age);

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log('error');
      }
      var account = accounts[0];
      App.contracts.RealEstate.deployed().then(function(instance) {
        // utf8 미리 파일 첨부해둠
        var nameUtf8Encoded = utf8.encode(name);
        // byte type을 hex로 변경
        // payable함수이기 때문에 ether도 전송해야 한다. 
        // 어느 계정에서 이 함수를 가져온지도 명시 해야 한다. from : account
        // 계정정보 호출은 web3로 해야한다. 
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), age, { from: account, value: price }); 
      }).then(function(){
        // input clear 확인
        $('#name').val('');
        $('#age').val('');
        $('#buyModal').modal('hide');
        //return App.loadRealEstates(); 
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  loadRealEstates: function() {
     // 매입후 ui 업데이트를 위해 실행하는 함수 
     App.contracts.RealEstate.deployed().then(function(instance) {
        return instance.getAllBuyers.call(); // 모든 buyer 정보를 가져온다. 
     }).then(function(buyers){
       for(i = 0; i < buyers.length; i++){
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          var imgType = $('.panel-realEstate').eq(i).find('img').attr('src').substr(7);

          switch(imgType) {
            case 'apartment.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/apartment_sold.jpg')
              break;
            case 'townhouse.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/townhouse_sold.jpg')
              break;
            case 'house.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/house_sold.jpg')
              break;
          }

          $('.panel-realEstate').eq(i).find('.btn-buy').text('매각').attr('disabled', true);
          $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style');
       }
      }
     }).catch(function(err) {
       console.log(err.message);
     })
  },
  
  // 매입 후 구매자가에게 알람 메세지 전송.
  // listenToEvents: function() {
  //   App.contracts.RealEstate.deployed().then(function(instance) {
  //     // filtering event : {}
  //     // 
  //     instance.LogBuyRealEstates({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(err, event){
  //       if(!error){
  //         $('#event').append('<p>' + event.args._buyer + ' 계정에서 ' + event.args_id  + ' 번 매물을 매입했습니다! ' +'</p>')
  //       } else {
  //         console.error(error);
  //       }
  //       App.loadRealEstates();
  //     })
  //   })
  // }
  listenToEvents: function() {
	  App.contracts.RealEstate.deployed().then(function(instance) {
      instance.LogBuyRealEstate({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          $('#events').append('<p>' + event.args._buyer + ' 계정에서 ' + event.args._id + ' 번 매물을 매입했습니다.' + '</p>');
        } else {
          console.error(error);
        }
        App.loadRealEstates();
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });

  $('#buyerInfoModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
   
    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo) {
      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1]));
      $(e.currentTarget).find('#buyerAge').text(buyerInfo[2]);
    }).catch(function(err) {
      console.log(err.message);
    })
  });

});
