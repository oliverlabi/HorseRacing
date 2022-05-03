import { message } from "antd";

const LoginPromptMessage = () => {
    const config = {
        maxCount: 1,
        content: 'You must login first!',
    }

    message.error(config);
}

export default LoginPromptMessage;