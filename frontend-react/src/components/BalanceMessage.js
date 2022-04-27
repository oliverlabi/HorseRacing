import { message } from "antd";
import MoneyCollectOutlined from '@ant-design/icons'

const BalanceMessage = (balanceMessage) => {
    const config = {
        content: balanceMessage,
        maxCount: 4
    }

    return(message.success(config));
}

export default BalanceMessage;