function process(files) {
    var plots = document.getElementById('plots');
    plots.innerHTML = '';

    for (var i = 0, f; f = files[i]; ++i) {
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                var lines = e.target.result.split(/\n/);
                if (lines[0][0] == '#') {
                    lines = lines.slice(1);
                }
                var splitter = /[,\s]/;

                var x = [];
                var y = [];
                var z = [];
                for (var j = 0; j < lines.length; ++j) {
                    var values = lines[j].split(splitter);
                    x.push(values[1]);
                    y.push(values[2]);
                    z.push(values[3]);
                }
                var plot = document.createElement('div');
                plot.id = escape(file.name);
                plots.append(plot);
                Plotly.plot(plot, [{
                    type: 'scatter3d',
                    mode: 'lines',
                    x: x,
                    y: y,
                    z: z,
                    opacity: 1,
                    line: {
                        width: 4,
                        color: '#427eff',
                        reversescale: false,
                    }
                }], {
                    title: escape(file.name),
                    margin: {
                        l: 50,
                        r: 50,
                        b: 50,
                        t: 50,
                    },
                    height: 800,
                    scene: {
                        aspectmode: "data",
                    },
                });
            };
        })(f);

        reader.readAsText(f);
    }

    toTop();
}

function handleFilesDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    process(files);
}

function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleFileSelect(e) {
    var files = e.target.files;
    process(files);
}

var drop_zone = document.getElementById('drop_zone');
drop_zone.addEventListener('dragover', handleDragOver, false);
drop_zone.addEventListener('drop', handleFilesDrop, false);

var click_upload = document.getElementById('click_upload');
click_upload.addEventListener('change', handleFileSelect, false);



window.onscroll = function () { onScroll() };

function onScroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("to_top").style.display = "block";
    } else {
        document.getElementById("to_top").style.display = "none";
    }
}

function toTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
