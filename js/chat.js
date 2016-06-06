var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
} ();

if (QueryString.host) {
    $('#host').val(QueryString.host);
}
if (QueryString.port) {
    $('#port').val(QueryString.port);
}
if (QueryString.path) {
    $('#path').val(QueryString.path);
}
if (QueryString.ssl) {
    $('#ssl').prop('checked', QueryString.ssl === 'true');
}
if (QueryString.otherId) {
    $('#otherid').val(QueryString.otherId);
}

$('#connectToPeerJS').on('click', function () {
    var peer = new Peer({
        host: $('#host').val(),
        port: $('#port').val(),
        path: $('#path').val(),
        secure: $('#ssl').is(':checked')
    });

    peer.on('open', function (id) {
        $('#myid').val(id);

        generateQRCode(id);

        $('#connectToPeer').on('click', function () {
            var otherid = $('#otherid').val();
            var conn = peer.connect(otherid);
            attachConnectionToChat(conn);
            return false;
        });

        peer.on('connection', function (conn) {
            attachConnectionToChat(conn);
        });
    });
    return false;
});

var attachConnectionToChat = function (conn) {
    var connectedWith = $('#connectedWith');
    connectedWith.text(conn.peer);

    var chatElem = $('#chat');

    conn.on('data', function (data) {
        chatElem.append('<div>' + conn.peer + ': ' + data + '</div>');
    });

    $('#post').on('click', function () {
        var message = $('#message');
        conn.send(message.val());
        chatElem.append('<div>me: ' + message.val() + '</div>');
        $('#message').val('');
        return false;
    });
};

var generateQRCode = function (id) {
    var url = window.location.href;
    if (url.indexOf('?') < 0) {
        url = url + '?';
    }
    url += 'host=' + $('#host').val()
        + '&port=' + $('#port').val()
        + '&path=' + encodeURIComponent($('#path').val())
        + '&ssl=' + ($('#ssl').is(':checked') ? 'true' : 'false')
        + '&otherId=' + id;
    console.log(url);
    $('#qrcode').qrcode(url);
};