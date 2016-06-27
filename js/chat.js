var connectToPeerJS = function () {
    peer = new Peer({
        host: $('#host').val(),
        port: $('#port').val(),
        path: $('#path').val(),
        secure: $('#ssl').is(':checked')
    });

    peer.on('open', function (id) {
        $('#myid').val(id);

        generateQRCode(id);

        $('#connectToPeer').on('click', connectToPeer);

        peer.on('connection', function (conn) {
            attachConnectionToChat(conn);
        });
        
        if ($('#otherid').val()) {
            connectToPeer();
        }
    });
    return false;
}

var connectToPeer = function () {
    var otherid = $('#otherid').val();
    var conn = peer.connect(otherid);
    attachConnectionToChat(conn);
    return false;
};

$('#connectToPeerJS').on('click', connectToPeerJS);

var peer = {};
var uri = URI(window.location.href);
var query = uri.search(true);

if (query.host) {
    $('#host').val(query.host);
}
if (query.port) {
    $('#port').val(query.port);
}
if (query.path) {
    $('#path').val(query.path);
}
if (query.ssl) {
    $('#ssl').prop('checked', query.ssl === 'true');
}
if (query.otherId) {
    $('#otherid').val(query.otherId);
}
if (query.host && query.port) {
    connectToPeerJS();
}

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
    var linkUri = URI(window.location.href);
    linkUri.search({
        host: $('#host').val(),
        port: $('#port').val(),
        path: $('#path').val(),
        ssl: ($('#ssl').is(':checked') ? 'true' : 'false'),
        otherId: id
    });
    console.log(linkUri.href());
    $('#qrcode').qrcode(linkUri.href());
};