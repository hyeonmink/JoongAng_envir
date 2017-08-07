function initMap() {
    console.log("?")
    var filteredData;
    var markers = [];

    var map


    d3.tsv('./data/schools.tsv', function(error, allData){
        console.log(allData)
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
            $('#browsers').append(`<option value="${d['학교명']}">${d['시도']} ${d['행정구']}</option>`)
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
            if($('#option1 option:selected')[0].value == ""){
                alert("시도를 선택하세요")
                return;
            } else if($('#option2 option:selected')[0].value == ""){
                alert("행정구를 선택하세요")
                return;
            }
            var province = ($('#option1 option:selected')[0].value)
            var city = ($('#option2 option:selected')[0].value)

            filteredData = allData.filter((d)=>{
                return d['시도'] == province && d['행정구'] == city
            })
            drawMap(filteredData)
        })


        var drawMap = (data) => {
            var minLat = d3.min(data, ()=>+data[0]["위도"])
            var maxLat = d3.max(data, ()=>+data[0]["위도"])
            var minLng = d3.min(data, ()=>+data[0]["경도"])
            var maxLng = d3.max(data, ()=>+data[0]["경도"])
            console.log(minLat, maxLat, minLng, maxLng)
            var avgLat = (maxLat + minLat) / 2;
            var avgLng = (maxLng + minLng) / 2;
            console.log(avgLat, avgLng)
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: {
                    lat: avgLat,
                    lng: avgLng
                },
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
                    content: `<h2>${d['학교명']}</h2><p>${d['위도']} ${d['경도']}</p>`
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });

                return marker
            })



   d3.tsv('./data/balam.tsv', function(error, allData){
        console.log("?")

        allData.map((d)=>{
            let coord = {
                lat: +d["경도"],
                lng: +d["위도"]
            }
            var circle = new google.maps.Circle({
                // strokeColor: '#FF0000',
                strokeOpacity: 0.0,
                // strokeWeight: 2,
                fillColor: '#000000',
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

    $('#searchByAddress').click(function(){
        console.log("?")
        $('.outer').css("background-color", "green")
    })


    $('#searchByName').click(function(){
        $('.outer').css("background-color", "yellowgreen")
    })


}


