

angular.module('tiago.qrcode', [])
  .directive('qrcode', function() {

    levels = {
      'L': 'Low',
      'M': 'Medium',
      'Q': 'Quartile',
      'H': 'High'
    },

    return {
      restrict: 'E',
      template: '<canvas></canvas>',
      link: function(scope, element, attrs) {

        console.log("Element = " + element);
        var domElement = element[0],
        canvas = element.find('canvas')[0],
        trim_regex = /^(\s+\n+)|(\s+|\n+)$/g,
        error,
        ECL,
        data,
        size,
        background,
        foreground,
        qr = new JSQR(),
        setECL = function(value) {
          ECL = value in levels ? value : 'L';
        },
        setData = function(value) {
          if (!value) {
            error = true;
            return;
          }

          data = value.replace(trim_regex, '');
          error = false;
        },
        setSize = function(value) {
          /* size = parseInt(value, 10) || modules * 2;
             tile = size / modules;
             canvas.width = canvas.height = size;*/
             //TODO: improve create_codeing size
        },

        create_code = function() {
          if (!qr || !canvas) {
            return;
          }
          if (error) {
            scope.$emit('qrcode:error', error);
            return;
          }


          var code = new qr.Code();
          code.encodeMode = code.ENCODE_MODE.UTF8_SIGNATURE;
          code.version = code.DEFAULT;
          if(ECL == 'L'){
            code.errorCorrection = code.ERROR_CORRECTION.L;
          }else if(ECL == 'M'){
            code.errorCorrection = code.ERROR_CORRECTION.M;
          }else if(ECL == 'Q'){
            code.errorCorrection = code.ERROR_CORRECTION.Q;
          }else if(ECL == 'H'){
            code.errorCorrection = code.ERROR_CORRECTION.H;
          }else{
            code.errorCorrection = code.ERROR_CORRECTION.L;
          }
      

          var input = new qr.Input();
          input.dataType = input.DATA_TYPE.TEXT;
          input.data = {
                "text": data
          };

          var matrix = new qr.Matrix(input, code);

          matrix.scale = 2;   //TODO change with size option   

          canvas.setAttribute('width', matrix.pixelWidth);
          canvas.setAttribute('height', matrix.pixelWidth);
          canvas.getContext('2d').fillStyle = 'rgb(0,0,0)'; //TODO change with colors
          matrix.draw(canvas, 0, 0);
        };


        attrs.$observe('ECL', function(value) {
          if (!value) {
            return;
          }

          setECL(value);
          setData(data);
          setSize(size);
          create_code();
        });

        attrs.$observe('data', function(value) {
          if (!value) {
            return;
          }

          setData(value);
          setSize(size);
          create_code();
        });

        attrs.$observe('size', function(value) {
          if (!value) {
            return;
          }

          setSize(value);
          create_code();
        });
/*
        setECL(attrs.ECL);
        setSize(attrs.size);
        setData(attrs.data);*/
      }
    };
  });