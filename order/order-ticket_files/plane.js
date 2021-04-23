($ => {
    
	$.fn.createPlane = function (obj, options) { 





		// obj = {
		// 	"1":{
		// 	"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"2":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"3":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"4":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"5":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"6":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"7":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"8":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"9":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"10":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 	"B":{"available":true,"price":665,"emergency_exit":false},
		// 	"C":{"available":true,"price":665,"emergency_exit":false},
		// 	"D":{"available":true,"price":665,"emergency_exit":false},
		// 	"E":{"available":true,"price":665,"emergency_exit":false},
		// 	"F":{"available":true,"price":665,"emergency_exit":false},
		// 	"G":{"available":true,"price":665,"emergency_exit":false},
		// 	"K":{"available":true,"price":665,"emergency_exit":false},
		// 	"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 	},
		// 	"11":{
		// 		"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 		"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"12":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"13":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"14":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"15":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"16":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"17":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"18":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"19":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
		// 		"20":{
		// 			"A":{"available":false,"price":0,"emergency_exit":false},
		// 		"B":{"available":true,"price":665,"emergency_exit":false},
		// 		"C":{"available":true,"price":665,"emergency_exit":false},
		// 		"D":{"available":true,"price":665,"emergency_exit":false},
		// 		"E":{"available":true,"price":665,"emergency_exit":false},
		// 		"F":{"available":true,"price":665,"emergency_exit":false},
		// 		"G":{"available":true,"price":665,"emergency_exit":false},
		// 		"K":{"available":true,"price":665,"emergency_exit":false},
		// 		"L":{"available":true,"price":665,"emergency_exit":false},
		// 	"M":{"available":true,"price":665,"emergency_exit":false},
		// 		},
			
		// }





		let canChoose = options.canChoose || 'can-choose';
		let stepsArray = [];
		let isPlaneHasError = false;
		let positionArrayX = [];
		let positionArrayY = [];
		let positionRows = [];
		let placeNamePosition = [];
		let windowWidth = $(window).width();
		
		// plane body
		let wingHeight = 1348;
		let wingPositionTop = 0;
		let tailPositionTop = -880;
		let planeBodyHeight = 640;
		let viewBoxLeft = 0;
		let viewBoxHeight = 1050;
		let viewBoxWidth = 560;

		const placesInRow = Object.keys(obj['1']);
		const totalplaceInRow = placesInRow.length;
		const totalRows = Object.keys(obj).length;
		const ths = $(this);
		const errorText = options.errorText || `Возможность выбрать места недоступна`;
		const rowKeysArray = Object.keys(obj);

		$( window ).resize(resizeFunc);

		function resizeFunc() {
			windowWidth = $(window).width();
			if(windowWidth < 700) {
				viewBoxLeft = 90;
				switch (totalplaceInRow) {
					case 2:
						viewBoxWidth = 220;
						break;
					case 4:
						viewBoxWidth = 300;
						break;
					case 6:
						viewBoxWidth = 380;
						break;
					case 8:
						viewBoxWidth = 460;
						break;
					case 10:
						viewBoxWidth = 540;
						break;
					}
			} else {
				viewBoxLeft = 0;
				switch (totalplaceInRow) {
					case 2:
						viewBoxWidth = 400;
						break;
					case 4:
						viewBoxWidth = 480;
						break;
					case 6:
						viewBoxWidth = 560;
						break;
					case 8:
						viewBoxWidth = 640;
						break;
					case 10:
						viewBoxWidth = 720;
						break;
				}
			}
		}

		resizeFunc();

		if(totalRows > 10) {
			const _heightBodyStep = 60;
			//const _heightViewBoxStep = 60;
			const _additionalBodySpace = _heightBodyStep * (totalRows - 10);
			//const _additionalViewBoxHeight = _heightViewBoxStep * (totalRows - 10);
			planeBodyHeight += _additionalBodySpace;
			tailPositionTop += _additionalBodySpace;
			viewBoxHeight += _additionalBodySpace;
			//viewBoxHeight += _additionalViewBoxHeight;
		}

		switch(true) {
			case totalRows < 10:
				wingHeight = 948;
				wingPositionTop = -300;
				break;
			case totalRows < 20:
				wingHeight = 948;
				break;
		}
		
		const planeStructure = {
			2: {planeBodyWidth: 145, planeBodyHeight, nose: 'M128,304 Q210, 100 273,304', wingLeftPositionLeft: -160, wingPositionTop, wingHeight, viewBoxLeft, viewBoxPadding: 100, viewBoxWidth, viewBoxHeight, tail: 'M128,1820 Q220,2228 273,1820', tailPositionTop, tailWing: -100, rowX: 200},
			4: {planeBodyWidth: 230, planeBodyHeight, nose: 'M128,304 Q245,-100 358,304', wingLeftPositionLeft: -80, wingPositionTop, wingHeight, viewBoxLeft, viewBoxPadding: 50, viewBoxWidth, viewBoxHeight, tail: 'M128,1820 Q250,2428 359,1820', tailPositionTop, tailWing: -50, rowX: 240},
			6: {planeBodyWidth: 304, planeBodyHeight, nose: 'M128,304 Q280,-304 432,304', wingLeftPositionLeft: 0, wingPositionTop, wingHeight, viewBoxLeft, viewBoxPadding: 0, viewBoxWidth, viewBoxHeight,         tail: 'M128,1820 Q280,2428 432,1820', tailPositionTop, tailWing: 0, rowX: 280},
			8: {planeBodyWidth: 383.5, planeBodyHeight, nose: 'M128,304 Q315,-506 511.5,304', wingLeftPositionLeft: 80, wingPositionTop, wingHeight, viewBoxLeft, viewBoxPadding: -40, viewBoxWidth, viewBoxHeight, tail: 'M128,1820 Q280,2528 511.5,1820', tailPositionTop, tailWing: 50, rowX: 320},
			10: {planeBodyWidth: 463, planeBodyHeight, nose: 'M128,304 Q350,-708 591,304', wingLeftPositionLeft: 160, wingPositionTop, wingHeight, viewBoxLeft, viewBoxPadding: -100, viewBoxWidth, viewBoxHeight,   tail: 'M128,1820 Q280,2628 591,1820', tailPositionTop, tailWing: 100, rowX: 360}, 
		}


		function getPositions() {
			let _xStart = 140;
			let _yStart = 340;
			let _rowsStart = 360;
			let _placeNameStart = 160;
			let _xStep = 40;
			let _yStep = 60;
			let _rowsStep = 60;
			let _middleStep = 40;
			
			for(let i = 0; i < totalplaceInRow; i++) {
				if(i < totalplaceInRow / 2) {
					positionArrayX.push(_xStart + _xStep * i)
				} else {
					positionArrayX.push(_xStart + _xStep * i + _middleStep)
				}
			}

			for(let i = 0; i < totalRows; i++) {
				positionArrayY.push(_yStart + _yStep * i);
			}

			for(let i = 0; i < totalRows; i++) {
				positionRows.push(_rowsStart + _rowsStep * i);
			}

			for(let i = 0; i < totalplaceInRow; i++ ) {
				if(i < totalplaceInRow / 2) {
					placeNamePosition.push(_placeNameStart + i * _xStep);
				} else {
					placeNamePosition.push(_placeNameStart + i * _xStep + _middleStep);
				}
				
			}
		}

		function getStepsArray() {
			let countY = 0;
			for(let key of rowKeysArray){
				let countX = 0;
				if(totalplaceInRow == Object.keys(obj[key]).length) {
					for(let place in obj[key]) {
						let _tempData = {}; // {x: 140, y: 340, cost: 650, place: 'A', row: 1, class: 'place-disabled'}
						let _class = obj[key][place]['available'] ? 'place' : 'place-disabled'; 
						_tempData.place = place;
						_tempData.row = countY + 1;
						_tempData.class = _class;
						_tempData.x = positionArrayX[countX];
						_tempData.y = positionArrayY[countY];
						_tempData.cost = obj[key][place]['price'];
						stepsArray.push(_tempData);
						countX++;
					}
				} else {
					isPlaneHasError = true;
					break;
				}	
				countY++;
			}
		}

		function checkPlaneHasError() {
			if(isPlaneHasError) {
				ths.html(planeHasErrorHtml);
			}
			return isPlaneHasError;
		}	
		
		const planeHtml = `
			<div class="plane-wrap {can_choose_val}">
				<div data-unselect="true"> </div>
				<svg viewBox="{view_box_left} {view_box_padding} {view_box_width} {view_box_height}">
		    	<symbol id="seatPrefix__seat-source" stroke-width="2">
		    		<path d="M6,25 L32,25 L32,6 C32,3.23857625 29.7614237,1 27,1 L11,1 C8.23857625,1 6,3.23857625 6,6 L6,25 Z"></path>
		    		<path d="M1,25 L6,25 L6,13 L3,13 C1.8954305,13 1,13.8954305 1,15 L1,25 Z"></path>
		    		<path d="M32,13 L32,25 L37,25 L37,15 C37,13.8954305 36.1045695,13 35,13 L32,13 Z"></path>
		    		<path d="M1,25 L1,29 C1,30.1045695 1.8954305,31 3,31 L35,31 C36.1045695,31 37,30.1045695 37,29 L37,25 L1,25 Z"></path>
		    	</symbol>
		    	<symbol id="seatPrefix__seat-selected">
		    		<use xlink:href="#seatPrefix__seat-source" fill="#64A433" fill-opacity="0.25" stroke="#89BF74"></use>
		    		<g fill="#FFFFFF" stroke="#89BF74" stroke-width="2" transform="translate(10.000000, 3.000000)">
		    			<circle cx="9" cy="5" r="4"></circle>
		    			<path d="M17,19.5 C17,15.3578644 13.418278,12 9,12 C4.581722,12 1,15.3578644 1,19.5"></path>
		    		</g>
		    	</symbol>
		    	<g fill="#EEEEEE" fill-rule="nonzero" stroke="none">
		    		<defs>
		    			<rect fill="#ff635f" id="seatPrefix__exit" rx="6" x="426" width="6" height="40"></rect>
		    			<polygon id="seatPrefix__tail-aircutter" points="280 1921.3333333333333 492.79999999999995 2111.333333333333 492.79999999999995 2225.333333333333 280 2111.333333333333"></polygon>
		    			<polygon id="seatPrefix__right-wing" points="432 750 1344 1534.875 1344 1680.2222222222222 432 {wing_height}"></polygon>
		    			<use xlink:href="#seatPrefix__seat-source" fill="#FFFFFF" id="seatPrefix__seat-disabled" stroke="#CCCCCC"></use>
		    			<use xlink:href="#seatPrefix__seat-source" fill="#FFFFFF" id="seatPrefix__seat" stroke="#A4C2EC"></use>
		    		</defs>
		    		<path d="{plane_nose}"></path>
		    		<rect x="128" y="304" width="{plane_body_width}" height="{plane_body_height}"></rect>
		    		<rect fill="#ffffff" rx="8" x="134" y="310" width="{plane_body_width_in}" height="{plane_body_height_in}"></rect>
					<g transform="translate(0, {tail_position_top})">
						<path d="{tail}"></path>
						<g transform="translate({tail_wing}, {tail_wing_left})">
							<polygon id="seatPrefix__tail-aircutter" points="280 1921.3333333333333 492.79999999999995 2111.333333333333 492.79999999999995 2225.333333333333 280 2111.333333333333"></polygon>
						</g>
						<g transform="translate({tail_wing_top_left}, {tail_wing_left})">
							<use class="tail-aircutter-flip" href="#seatPrefix__tail-aircutter" style="transform-origin: 280px 1921.33px 0px;"></use>
						</g>
					</g>
					<g>
						<g transform="translate({wing_left_position_left}, {wing_position_top})">
							<polygon id="seatPrefix__right-wing" points="432 750 1344 1534.875 1344 1680.2222222222222 432 {wing_height}"></polygon>
						</g>
						<g transform="translate(0, {wing_position_top})">
							<use class="tail-aircutter-flip" href="#seatPrefix__right-wing" style="transform-origin: 280px 750px 0px;"></use>
						</g>
					</g>
		    	</g>
		    	<g>
					{place_name}
		    	</g>
		    	<g>
					{seat_place}
					{row_place}
				</g>
			</svg>
		</div>
		`;

	    const seatPlaceHtml = `
	    <g onclick="changerect(event)">
			<g class="g-wrap {place_class}" stroke-width="2"  transform="translate({x_position},{y_position})" 
			data-user-id="{user_id}" data-hash="{hash}" data-position-row="{position_row}" data-position-place="{position_place}">
                <g class="place-man" fill="#FFFFFF" stroke-width="2" transform="translate(10.000000, 3.000000)" >
					<circle cx="9" cy="5" r="4"></circle>
					<path d="M17,19.5 C17,15.3578644 13.418278,12 9,12 C4.581722,12 1,15.3578644 1,19.5"></path>
				</g>

                <path d="M6,25 L32,25 L32,6 C32,3.23857625 29.7614237,1 27,1 L11,1 C8.23857625,1 6,3.23857625 6,6 L6,25 Z"></path>
                <path d="M1,25 L6,25 L6,13 L3,13 C1.8954305,13 1,13.8954305 1,15 L1,25 Z"></path>
                <path d="M32,13 L32,25 L37,25 L37,15 C37,13.8954305 36.1045695,13 35,13 L32,13 Z"></path>
                <path d="M1,25 L1,29 C1,30.1045695 1.8954305,31 3,31 L35,31 C36.1045695,31 37,30.1045695 37,29 L37,25 L1,25 Z"></path>
                <text class="place-cost" text-anchor="middle" x="20" y="45">{place_cost}</text>
            </g>
	    </g>
		`
		
		const rowHtml = `<text class="row-num" fill="#CCCCCC" text-anchor="middle" x="{row_x_position}" y="{y_position}" > {row_num} </text>`;

		const placeNameHtml = `<text fill="#CCCCCC" text-anchor="middle" x="{x_position}" y="330"> {place_name} </text>`;

		const planeHasErrorHtml = `<h3>${errorText}</h3>`;

		getPositions();
		getStepsArray();
		if( checkPlaneHasError()) return;

		let _seatsHtml = '';
		let _rowHtml = '';
		let _placeNameHtml = '';

		// seat places
	    stepsArray.forEach((item)=>{
			let _tempHtml = seatPlaceHtml;
			_tempHtml = _tempHtml.replace('{user_id}', options.userId);
			_tempHtml = _tempHtml.replace('{hash}', options.hash);
			_tempHtml = _tempHtml.replace('{position_row}', item.row);
			_tempHtml = _tempHtml.replace('{place_class}', item.class);
			_tempHtml = _tempHtml.replace('{position_place}', item.place);
	    	_tempHtml = _tempHtml.replaceAll('{x_position}', item.x);	
	    	_tempHtml = _tempHtml.replaceAll('{y_position}', item.y);
	    	_tempHtml = _tempHtml.replace('{place_cost}', item.cost);	
	    	_seatsHtml += _tempHtml;
	    });
		
		// rows
		positionRows.forEach( function(item, index) {
			let _tempHtml = rowHtml;
			_tempHtml = _tempHtml.replace('{y_position}', item)
			_tempHtml = _tempHtml.replace('{row_num}', index + 1)
			_rowHtml += _tempHtml;
		});
		
		// place Name

		placeNamePosition.forEach( function(item, index){
			let _tempHtml = placeNameHtml;
			_tempHtml = _tempHtml.replace('{x_position}', item)
			_tempHtml = _tempHtml.replace('{place_name}', placesInRow[index])
			_placeNameHtml += _tempHtml;
		})

		let _totalHtml = planeHtml.replace('{seat_place}', _seatsHtml);
		_totalHtml = _totalHtml.replace('{row_place}', _rowHtml);
		_totalHtml = _totalHtml.replace('{place_name}', _placeNameHtml);
		_totalHtml = _totalHtml.replace('{can_choose_val}', canChoose);


		_totalHtml = _totalHtml.replace('{view_box_left}', planeStructure[totalplaceInRow]['viewBoxLeft']);
		_totalHtml = _totalHtml.replace('{view_box_padding}', planeStructure[totalplaceInRow]['viewBoxPadding']);
		_totalHtml = _totalHtml.replace('{view_box_height}', planeStructure[totalplaceInRow]['viewBoxHeight']);
		_totalHtml = _totalHtml.replace('{view_box_width}', planeStructure[totalplaceInRow]['viewBoxWidth']);
		_totalHtml = _totalHtml.replace('{wing_left_position_left}', planeStructure[totalplaceInRow]['wingLeftPositionLeft']);
		_totalHtml = _totalHtml.replaceAll('{wing_height}', planeStructure[totalplaceInRow]['wingHeight']);
		_totalHtml = _totalHtml.replaceAll('{wing_position_top}', planeStructure[totalplaceInRow]['wingPositionTop']);
		_totalHtml = _totalHtml.replace('{plane_nose}', planeStructure[totalplaceInRow]['nose']);
		_totalHtml = _totalHtml.replace('{plane_body_width}', planeStructure[totalplaceInRow]['planeBodyWidth']);
		_totalHtml = _totalHtml.replace('{plane_body_width_in}', planeStructure[totalplaceInRow]['planeBodyWidth'] - 12);
		_totalHtml = _totalHtml.replace('{plane_body_height}', planeStructure[totalplaceInRow]['planeBodyHeight']);
		_totalHtml = _totalHtml.replace('{plane_body_height_in}', planeStructure[totalplaceInRow]['planeBodyHeight'] - 12);
		_totalHtml = _totalHtml.replace('{tail}', planeStructure[totalplaceInRow]['tail']);
		_totalHtml = _totalHtml.replace('{tail_position_top}', planeStructure[totalplaceInRow]['tailPositionTop']);
		_totalHtml = _totalHtml.replace('{tail_wing}', planeStructure[totalplaceInRow]['tailWing']);
		_totalHtml = _totalHtml.replace('{tail_wing_top_left}', planeStructure[totalplaceInRow]['tailWing']/2);
		_totalHtml = _totalHtml.replace('{tail_wing_top}', planeStructure[totalplaceInRow]['tailWing'] / 2);
		_totalHtml = _totalHtml.replaceAll('{tail_wing_left}', planeStructure[totalplaceInRow]['tailWing']);
		_totalHtml = _totalHtml.replaceAll('{row_x_position}', planeStructure[totalplaceInRow]['rowX']);


		ths.html(_totalHtml);
	}	
})(jQuery);

function changerect(evt) {
	const el = $(evt.target).parent('.g-wrap');
	const canChoose = el.parents('.plane-wrap').hasClass('can-choose');
	if(!canChoose) return;

	const _hash = el.data('hash');
	const _userId = el.data('user-id');
	const _row = el.data('position-row');
	const _place = el.data('position-place');
	const _dataPlace = {row: _row, place: _place};
	if(el.hasClass('place')){
		const _selectedEl = el.parents('.plane-wrap').find('.place-selected');
		if(_selectedEl.length) {
			const _rowSelected = _selectedEl.data('position-row');
			const _placeSelected = _selectedEl.data('position-place');
			const _dataPlaceSelected = {row: _rowSelected, place: _placeSelected};

			if(typeof onPlaceSelected == 'function') {
				_selectedEl.removeClass('place-selected').addClass('place');
				onPlaceSelected(false, _dataPlaceSelected, _userId, _hash);
			}
		}

		if(typeof onPlaceSelected == 'function') {
			el.removeClass('place').addClass('place-selected');
			onPlaceSelected(true, _dataPlace, _userId, _hash);
		}
	} else if (el.hasClass('place-selected')){
		if(typeof onPlaceSelected == 'function') {
			el.removeClass('place-selected').addClass('place');
			onPlaceSelected(false, _dataPlace, _userId, _hash);
		}
	}
}
