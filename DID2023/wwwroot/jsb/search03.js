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


    $("#inline_content input[name='type']").click(function () {
        $('#search-two').hide();
        $('#adsoyad').val('');
        $('#tel').val('');
        if ($('input:radio[name=type]:checked').val() == "personel") {
            $('#search-two').show();
        }
    });
});

function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].plaka == nameKey) {
            return myArray[i].ilceleri;
        }
    }
};

function locationFindData() {

    if (!validation()) {
        $('#sokak1').val($('#sokak').val().toLocaleUpperCase('TR'));
        $('#mahalle1').val($('#mahalle').val().toLocaleUpperCase('TR'));
        $('#ilce1').val($('#select-ilceler').val());
        $('#sehir1').val($('#select-sehirler').val());
        $('#adsoyad1').val($('#adsoyad').val().toLocaleUpperCase('TR'));
        $('#tel1').val($('#tel').val());
        var $items = $('#adsoyad1,#tel1,#canlisayisi1,#evsahibitel1,#mahalle1,#sokak1,#binano1,#katno1,#daireno1,#ilce1,#sehir1,#yakin1,#yakinadsoyad1,#yakinceptel1,#yakinevtel1 ');

        var obj = {}
        $items.each(function () {
            obj[this.id] = $(this).val()
        })
        //console.log(JSON.stringify(obj, null, ' '));
        $('#accordion').empty();
        $('#tbodyMaster0').empty();
        $.ajax({
            url: '/Home/GetPersonLocation?obj=' + JSON.stringify(obj, null, ' '),
            success: function (data) {
                if (data[0] != null) {
                    $('#accordion').append(`
                        <p>Yuvarlak içinde gösterilen değer dairede bulunan canlı sayısıdır.</p>
                        <div class="card">
                            <div class="card-header">
                                <a class="btn" data-bs-toggle="collapse" href="#collapse${0}"><b>Bina No/Ad: ${data[0].bina}</b></a>
                            </div>
                            <div id="collapse${0}" class="collapse show" data-bs-parent="#accordion">
                                <div class="card-body">
                                    <table class="table">
                                        <tbody id="tbodyMaster${0}">
                                        
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    `);

                    for (var i = 0; i < data[0].perList.length; i++) {
                        //console.log(data[0].perList[i].adsoyad1);
                        var objem = data[0].perList[i];
                        $('#tbodyMaster0').append(`
                        <tr>
                           <td>${data[0].perList[i].adsoyad1}</td>
                           <td>${data[0].perList[i].katno1}.Kat Daire:${data[0].perList[i].daireno1}</td>
                           <td><button class="rounded-circle">${data[0].perList[i].canlisayisi1}</button></td>
                           <td><a class="btn btn-success btn-sm" href="tel://+9${data[0].perList[i].tel1}}">Ara</a></td>
                           <td><button class="btn btn-danger btn-sm" id="btndetail" onclick="openForm('${data[0].perList[i].adsoyad1}','${data[0].perList[i].yakinadsoyad1}','${data[0].perList[i].yakin1}','${data[0].perList[i].yakinceptel1}','${data[0].perList[i].yakinevtel1}');">Yakını</button></td>
                        </tr>
                        `);
                    }

                    for (var i = 1; i < data.length; i++) {
                        $('#accordion').append(`
                        <div class="card">
                             <div class="card-header">
                                <a class="collapsed btn" data-bs-toggle="collapse" href="#collapse${i}"><b>Bina No/Ad: ${data[i].bina}</b></a>
                            </div>
                            <div id="collapse${i}" class="collapse" data-bs-parent="#accordion">
                                <div class="card-body">
                                    <table class="table">
                                        <tbody id="tbodyMaster${i}">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `);

                        for (var x = 0; x < data[i].perList.length; x++) {
                            $('#tbodyMaster' + i).append(`
                        <tr>
                           <td>${data[i].perList[x].adsoyad1}</td>
                           <td>${data[i].perList[x].katno1}.Kat Daire:${data[i].perList[x].daireno1}</td>
                           <td><button class="rounded-circle">${data[i].perList[x].canlisayisi1}</button></td>
                           <td><a class="btn btn-success btn-sm" href="tel://+9${data[i].perList[x].tel1}">Ara</a></td>
                           <td><button class="btn btn-danger btn-sm" id="btndetail" onclick="openForm('${data[i].perList[x].adsoyad1}','${data[i].perList[x].yakinadsoyad1}','${data[i].perList[x].yakin1}','${data[i].perList[x].yakinceptel1}','${data[i].perList[x].yakinevtel1}');">Yakını</button></td>
                        </tr>
                        `);
                        }
                    }
                }
                else {
                    var infoObj = $('#info');
                    infoObj.text('Herhangi Bir Kayıt Bulunamadı');
                    infoObj.show('slow');
                    window.setTimeout(function () {
                        infoObj.hide('slow');
                    }, 5000);
                }
            }
        });
    }
};


function openDataForm() {
    $('#form-data').show();
};

function openForm(adsoyad1, yakinadsoyad1, yakin1, yakinceptel1, yakinevtel1) {
    $('#headerTitle').empty();
    $('#tbdetailYakini').empty();
    document.getElementById('id01').style.display = 'block';
    $('#headerTitle').append('<b>' + adsoyad1 + '</b>');
    $('#tbdetailYakini').append('<tr><td><b>Yakını: </b> ' + yakinadsoyad1 + '</td></tr>');
    $('#tbdetailYakini').append('<tr><td><b>Yakınlık Derecesi: </b> ' + yakin1 + '</td></tr>');
    $('#tbdetailYakini').append('<tr><td><a class="btn btn-success btn-sm" href="tel://+9' + yakinceptel1 + '"> ' + yakinceptel1 +' Ara</a></td></tr>');
    if (yakinevtel1 != 'null') {
        $('#tbdetailYakini').append('<tr><td><a class="btn btn-success btn-sm" href="tel://+9' + yakinevtel1 + '"> ' + yakinevtel1 + ' Ara</a></td></tr>');
    }
}

function validation() {
    var isEmpty = false;

    let sehirObj = $('#select-sehirler');
    let ilceObj = $('#select-ilceler');
    let mahObj = $('#mahalle');
    let sokakObj = $('#sokak');

    if (isNull(sehirObj) || isNull(ilceObj) || isNull(mahObj) || isNull(sokakObj)) {
        isEmpty = true;
        return isEmpty;
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

