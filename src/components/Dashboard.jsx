import React from 'react';
import Card from './Card';
import List from './List';


const Dashboard = ({data}) => {

    return (
        <div className="App-page">
            <div className="App-row">
                <Card title={"365,000+"} subTitle="Recipies🍳"/>  
                <Card title={"27"} subTitle="Cuisines 🍝🍔"/>  
                <Card title={"11"} subTitle="Diets🍴"/>
            </div>
            <div className="App-row">
                <List data={data}/>
            </div>
        </div>  
    )
}

export default Dashboard;