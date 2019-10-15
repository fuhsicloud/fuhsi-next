import { axios } from '@/utils/request'
import 'xterm/dist/xterm.css'
import { Terminal } from '@/utils/Xterm'

export default {
    socket: null,
    term: null,
    param: {
        cluster: '',
        container: '',
        namespace: '',
        pod: '',
        timestamp: '',
        token: '',
        username: ''
    },
    contextPath: (window.location.protocol === "https:" ? "wss://" : "ws://") + document.domain,
    backgroundColor: '#000000',
    fontColor: '#cccccc',
    offset: null,
    termContainer: document.getElementById('terminal-container'),
    open () {
        this.term = new Terminal({
            termName: 'xterm',
            userStyle: true,
            screenKeys: true,
            cursorBlink: false,
            convertEol: true,
            scrollback: 1000,
            tabstopwidth: 4,
            colors: Terminal.xtermColors
        })
    }    
}