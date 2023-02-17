"use strict";

$(document).ready(function () {
    var formdata = [];
    let objSehirler = $('#select-sehirler');
    let objilceler = $('#select-ilceler');

    objSehirler.empty();
    let ilceler = [];

    const sehirlerjsonurl = '/data/sehirler.json';
    $.getJSON(sehirlerjsonurl, function (data) {
        ilceler = data;
        $.each(data, function (a, b) {
            objSehirler.append(new Option(b.il, b.plaka));
        });
    });

    objSehirler.append(new Option('Lütfen Bir Şehir seçiniz', 0));
    objSehirler.prop('selectedIndex', 0);

    objSehirler.change(function () {

        var valueSelected = this.value; if (objSehirler.val() > 0) {
            objilceler.empty();
            objilceler.append(new Option('Lütfen Bir İlçe seçiniz', 0));
            objilceler.prop('selectedIndex', 0);
            objilceler.prop("disabled", false);
            var resultObject = search(objSehirler.val(), ilceler);
            $.each(resultObject, function (a, b) {
                objilceler.append(new Option(b, a + 1));
            });
            return false;
        }
        $('#select-ilceler').prop("disabled", true);
    });
});

function nextPage(hidePage, showPage) {
    if (!validation(hidePage)) {
        $('#error').hide();
        $('#p' + hidePage).hide();
        $('#p' + showPage).show();
        inputSet();
    }
    else {
        $('#error').show();
        window.setTimeout(function () {
            $('#error').hide('slow');
        }, 3000);
    }
};

function backPage(hidePage, showPage) {
    $('#p' + hidePage).hide();
    $('#p' + showPage).show();
};

function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].plaka == nameKey) {
            return myArray[i].ilceleri;
        }
    }
};

function inputSet() {
    $('#adsoyad1').val($('#adsoyad').val().toLocaleUpperCase('TR'));
    $('#tel1').val(returnPhoneNumber($('#tel')));
    $('#canlisayisi1').val($('#canlisayisi').val());
    $('#evsahibitel1').val(returnPhoneNumber($('#evsahibitel')));
    $('#mahalle1').val($('#mahalle').val().toLocaleUpperCase('TR'));
    $('#sokak1').val($('#sokak').val().toLocaleUpperCase('TR'));
    $('#binano1').val($('#binano').val().toLocaleUpperCase('TR'));
    $('#katno1').val($('#katno').val().toLocaleUpperCase('TR'));
    $('#daireno1').val($('#daireno').val().toLocaleUpperCase('TR'));
    $('#ilce1').val($('#select-ilceler').val());
    $('#sehir1').val($('#select-sehirler').val());

    $('#yakin1').val($('#yakin').val().toLocaleUpperCase('TR'));
    $('#yakinadsoyad1').val($('#yakinadsoyad').val().toLocaleUpperCase('TR'));
    $('#yakinceptel1').val(returnPhoneNumber($('#yakinceptel')));
    $('#yakinevtel1').val(returnPhoneNumber($('#yakinevtel')));

};

function saveData() {

    var $items = $('#adsoyad1,#tel1,#canlisayisi1,#evsahibitel1,#mahalle1,#sokak1,#binano1,#katno1,#daireno1,#ilce1,#sehir1,#yakin1,#yakinadsoyad1,#yakinceptel1,#yakinevtel1 ');

    var obj = {}
    $items.each(function () {
        obj[this.id] = $(this).val()
    })
    //console.log(JSON.stringify(obj, null, ' '));

    $.ajax({
        url: '/Home/Add?obj=' + JSON.stringify(obj, null, ' '),
        success: function (data) {
            
            var infoObj = $('#info');
            infoObj.text(data);
            infoObj.show('slow');
            window.setTimeout(function () {
                infoObj.hide('slow');
            }, 5000);
        }
    });

  
};

function validation(pageNo) {
    var isEmpty = false;
    if (pageNo == 1) {
        let sehirObj = $('#select-sehirler');
        let ilceObj = $('#select-ilceler');
        let mahObj = $('#mahalle');
        let sokakObj = $('#sokak');

        if (isNull(sehirObj) || isNull(ilceObj) || isNull(mahObj) || isNull(sokakObj)) {
            isEmpty = true;
            return isEmpty;
        }
    }
    else if (pageNo == 2) {
        let binanoObj = $('#binano');
        let katnoObj = $('#katno');
        let dairenObj = $('#daireno');
        let evsahibitelObj = $('#evsahibitel');

        if (isNull(binanoObj) || isNull(katnoObj) || isNull(dairenObj)) {
            isEmpty = true;
            return isEmpty;
        }
    }
    else if (pageNo == 3) {
        let canlisayisiObj = $('#canlisayisi');
        let adsoyadObj = $('#adsoyad');
        let telObj = $('#tel');

        if (isNull(canlisayisiObj) || isNull(adsoyadObj) || isNull(telObj)) {
            isEmpty = true;
            return isEmpty;
        }
    }
    else if (pageNo == 4) {
        let yakinObj = $('#yakin');
        let yakinadsoyadObj = $('#yakinadsoyad');
        let yakinceptelObj = $('#yakinceptel');
        let yakinevtelObj = $('#yakinevtel');

        if (isNull(yakinObj) || isNull(yakinadsoyadObj) || isNull(yakinceptelObj)) {
            isEmpty = true;
            return isEmpty;
        }
    }


};

function isNull(obj) {
    var inputs = obj;
    var isEmpty = false;

    for (var i = inputs.length; i--;) {
        //console.log(inputs[i].value.length + ">=L + V=>" + inputs[i].value);
        if (inputs[i].value.length === 0) {
            obj.css('border-color', '#eb6b93');
            isEmpty = true;
            return isEmpty;
        }
        else if (inputs[i].value === '0') {
            obj.css('border-color', '#eb6b93');
            isEmpty = true;
            return isEmpty;
        }
    }

};

function returnPhoneNumber(obj) {
    let phone_number = obj.val();
    phone_number = phone_number.replace(/\D/g, '')
    let match = phone_number.match(/^(\d{3})(\d{3})(\d{4})$/)

    if (match) {
        phone_number = 0 + '(' + match[1] + ')' + match[2] + match[3]
    }
    return phone_number;
}
