import {Col, Row} from 'antd';
import {Outlet} from 'umi';

export default () => <Row>
    <Col xs={{
        span: 22,
        offset: 1
    }}
         md={{
             span: 20,
             offset: 2
         }}>
        <Outlet/>
    </Col>
</Row>