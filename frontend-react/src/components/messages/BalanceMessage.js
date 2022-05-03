import { message } from "antd";
import MoneyCollectOutlined from '@ant-design/icons'

const BalanceMessage = (balanceMessage) => {
    const config = {
        maxCount: 4,
        content: balanceMessage,
    }

    return(message.success(config));
}

export default BalanceMessage;