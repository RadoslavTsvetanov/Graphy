import type React from "~node_modules/@types/react";
import type { ITab, TabGraph } from "~storageRepo";


export const Taber: React.FC<{ tab: ITab }> = ({ tab }) => {
    return <div>
        {JSON.stringify(tab.info)}
        {tab.getRelations({}).map(t => {
            return <Taber tab={tab}/>
        })}
    </div>
}


export const TabGrapher: React.FC<{graph: TabGraph}> = ({graph}) => {
    
    
    return (
        <div>
            {graph.windows.map(g => {
                return g.tabs.map(tab => {
                    return <Taber tab={tab} />
            })
        })}
        </div>
    )
}