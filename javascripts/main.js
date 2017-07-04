var host = "http://1.119.49.62:7474/";
var Type = ''; //搜索类型
var Name = '';
/*----vis配置信息-----*/
/*var options = {
    // autoResize:true,
    nodes: {
        shape: 'icon',
        // shape: 'dot',
        borderWidth: 2,
        icon: {
            face: 'FontAwesome',
            // code: '\uf057',
            code: '\uf007',
            size: 20,
            color: '#aa00ff'
        },
        // borderWidth: 4,
    },
    groups: {
        公司: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf1ad',
                size: 30,
                color: '#f0a30a'
            },
            borderWidth: 4,
        },
        企业: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf1ad',
                size: 30,
                color: '#f0a30a'
            },
            borderWidth: 4,
        },
        项目: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf0ae',
                size: 30,
                color: '#6e6efd'
            }
        },
        法人: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf2be',
                size: 30,
                color: '#ff756e'
            }
        },
        股东: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf007',
                size: 30,
                color: '#57169a'
            }
        }
    },
    edges: {
        "width": 2,
        "arrows": {
            "to": {
                "enabled": true,
                "scaleFactor": 0.5
            }
        },
        "font": {
            size: 6,
            color: '#666',
            align: 'middle',
        },
        "smooth": {
            // "type": "cubicBezier",
            "forceDirection": "vertical",
            // "roundness": 0.35
        }
    },
    "physics": {
        "barnesHut": {
            // "springLength": 100,
            // "springConstant": 0.03,
            // "avoidOverlap": 0.5,
            // "damping": 0.5,
            // "centralGravity": 0.5,
        },
        // "minVelocity": 0.75,
        // "timestep": 0.1,
        // "minVelocity": 1,
        // "solver": "repulsion"
    }
};*/
var options = {};
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
nodes.add({
    group:"法人",
    id:6094,
    label:"AA",
    title:"AA"
});
var data = {
    nodes: nodes,
    edges: edges
};
var container = document.getElementById('mynetwork');
var network = new vis.Network(container, data, options);

setTimeout(function(){
    alert(1);
    network.redraw();
    console.log(network);
},1000);
getFirstLabel();

$('#submit').on('click', function() {
    // console.log($('#nope').val());
    if ($('#nope').val() == '') {
        alert('请输入查询内容');
    } else {
        nodes.clear();
        edges.clear();
        getRoot(Type, $('#nope').val());
        // var network = new vis.Network(container, data, options);
        network.setData({nodes:nodes,edges:edges});
    }
});

function getFirstLabel() {
    $.ajax({
        url: host + 'db/data/labels',
        type: 'get',
        async: false,
        Accept: 'application/json; charset=UTF-8',
        success: function(res) {
            console.log(res);
            var _html = "";
            for (var i = 0; i < res.length; i++) {
                _html += '<option>' + res[i] + '</option>';
            }
            console.log(_html);
            $('.Type').html(_html);
            Type = $('.Type').val();
            fn(Type, '#nope');
            $('.Type').on('change', function() {
                Type = $('.Type').val();
                $('#nope').val('');
                nodes = new Set();
                edges = new Set();
                source = [];
                fn(Type, '#nope');
            });
        }
    });
}

/*-------创建2级标签-------*/
function fn(type, name) {
    $.ajax({
        url: host + 'db/data/cypher',
        type: 'post',
        async: false,
        accept: 'application/json;charset=UTF-8',
        contentType: 'application/json',
        data: JSON.stringify({
            "query": "MATCH (n:" + type + ") RETURN n.名称 order by n.名称",
            "params": {}
        }),
        success: function(res) {
            console.log(res);
            source = [];
            for (var i = 0; i < res.data.length; i++) {
                source.push({
                    "label": res.data[i][0]
                });
            }
            $(name).autocompleter('destroy');
            $(name).autocompleter({
                source: source,
                highlightMatches: true,
                hint: true,
                limit: 1000,
            });
        }
    });
};
/*-------根节点-----------*/
function getRoot(Type, Name) {
    $.ajax({
        url: host + 'db/data/cypher',
        type: 'post',
        async: false,
        accept: 'application/json;charset=UTF-8',
        contentType: 'application/json',
        data: JSON.stringify({
            "query": "MATCH (n:" + Type + " {名称: '" + Name + "'}) RETURN n",
        }),
        success: function(res) {
            console.log(res);
            rootId = res.data[0][0].metadata.id
            nodes.add({
                    'group': res.data[0][0].metadata.labels[0],
                    // 'group': res.data[0][0].metadata.labels[0],
                    'id': res.data[0][0].metadata.id,
                    // 'label': '<p class="nodeLabel" style="color:red;">' + res.data[0][0].data.名称 + '<p>',
                    'label': res.data[0][0].data.名称,
                    'font': {
                        'multi': true,
                    },
                    'title': res.data[0][0].data.名称
                })
            console.log(nodes);
                /*inC(res.data[0][0].metadata.id, res.data[0][0].incoming_relationships);
                outC(res.data[0][0].metadata.id, res.data[0][0].outgoing_relationships);*/
        }
    })
}
