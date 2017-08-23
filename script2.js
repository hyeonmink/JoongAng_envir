function initMap() {
    var filteredData;
    var markers = [];

    var map


    d3.tsv('./data/schools.tsv', function(error, allData){
        cities = {}
        cityName = []
        allData.map((d)=>{
            if(!cities[d['시도']]){
                cityName.push(d['시도'])
                cities[d['시도']] = []
            }
            if(cities[d['시도']].indexOf(d['행정구']) == -1){
                cities[d['시도']].push(d['행정구'])
            }

            $('#browsers').append(`<option value='${d["학교명"]} (${d["시도"]} ${d["행정구"]})'>`)



        })
        cityName.sort().map((city)=>{
            $('#option1').append(`<option value="${city}">${city}</option>`)
        })

        $('#option1').on('change', function() {
            $('#option2').empty();
            $('#option2').append(`<option value="" disabled selected>행정구</option>`)
            cities[this.value].sort().map((county)=>{
                $('#option2').append(`<option value="${county}">${county}</option>`)
            })
        })

        $('#submit').on('click', ()=>{
            var selected = $('#browserInput').val();
            if(selected){
                $('#option1 option').removeAttr('selected')
                $('#option2 option').removeAttr('selected')
                selected = selected.substring(selected.indexOf('(')+1, selected.indexOf(')')).split(' ')
                console.log(selected[0], selected[0].length)
                $(`#option1 [value=${selected[0]}]`).attr('selected', 'selected')
                $('#option2').empty();
                cities[selected[0]].sort().map((county)=>{
                    $('#option2').append(`<option value="${county}">${county}</option>`)
                })
                $(`#option2 [value=${selected[1]}]`).attr('selected', 'selected')
            }
            else {
                if($('#option1 option:selected')[0].value == ""){
                    alert("시도를 선택하세요")
                    return;
                } else if($('#option2 option:selected')[0].value == ""){
                    alert("행정구를 선택하세요")
                    return;
                }
            }
            var province = ($('#option1 option:selected').val())
            var city = ($('#option2 option:selected').val())

            filteredData = allData.filter((d)=>{
                return d['시도'] == province && d['행정구'] == city
            })
            var center;
            if(selected){
                console.log("뭔가 입력함")
                filteredData.map((school)=>{
                    if(school['학교명'] == $('#browserInput').val().split(' (')[0]){
                        center = {
                            lat: +school['위도'],
                            lng: +school['경도'],
                            name: school['학교명']
                        }
                    }
                })
            }
            !selected ? drawMap(filteredData) : drawMap(filteredData, center)
            $('#browserInput').val('')
        })        

        var drawMap = (data, center_place) => {
            var center;
            if(!center_place){
                center = {
                    lat: d3.mean(data, ()=>+data[0]["위도"]),
                    lng: d3.mean(data, ()=>+data[0]["경도"])
                }
            } else {
                center = {
                    lat: +center_place.lat,
                    lng: +center_place.lng,
                    name: center_place.name
                }
            }
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center,
                mapTypeId: 'roadmap',
            });        

            markers.map((marker)=>{
                marker.setMap(null)
            })
            markers = data.map((d)=>{
                let coord = {
                    lat: +d["위도"],
                    lng: +d["경도"]
                }
                var marker = new google.maps.Marker({
                    position: coord,
                    map: map,
                })

                var infowindow = new google.maps.InfoWindow({
                    content: `<h2>${d['학교명']}</h2>`
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
                
                if(center['name'] == d['학교명']){
                    infowindow.open(map, marker);
                }
                return marker
            })



   d3.tsv('./data/balam.tsv', function(error, allData){

        allData.map((d)=>{
            let coord = {
                lat: +d["경도"],
                lng: +d["위도"]
            }
            var circle = new google.maps.Circle({
                // strokeColor: '#FF0000',
                strokeOpacity: 0.0,
                // strokeWeight: 2,
                fillColor: '#ff0000',
                fillOpacity: +d.배출량 / 815660 * 0.7 + 0.03,
                map: map,
                center: coord,
                radius: 2000
            });

                    var infowindow = new google.maps.InfoWindow({
                        content: `<h2>${d['배출량']}</h2>`
                    });

                    circle.addListener('click', function() {
                        $("#info").html(`<h2>${d['배출량']}</h2>`)
                    });
                        return circle;


                   })
            })





        }
    })


 






}
