import { reactive } from 'vue'

export const confirmState = reactive({
    show: false,
    message: '',
    callback: null,
    okText: 'OK',
    type: 'default', // 'default' atau 'danger'
})

export function confirmBox(message, callback = null, options = {}) {
    confirmState.message = message
    confirmState.callback = callback
    confirmState.okText = options.okText || 'OK'
    confirmState.type = options.type || 'default'
    confirmState.show = true
}

export async function confirmOk() {
    if (confirmState.callback) {
        // Support both sync dan async callbacks
        await Promise.resolve(confirmState.callback())
    }
    confirmState.show = false
}

export function confirmCancel() {
    confirmState.show = false
}

export default confirmBox
