import { useSelector, useDispatch } from 'react-redux'
import { CompItem_Workbench, WorkbenchListState, ComponentMenuState } from '../../../../utils/interface'
import {
  setActiveItem,
  setDropStatus,
  delAllSelect,
  addElement,
  updateAllSelect,
} from '../../../../store/slices/workbenchList'
import WorkbenchItem from './WorkbenchItem'
import { v4 as uuid } from 'uuid';
import { componentMap } from '../../../../utils/componentMap'

const Workbench = () => {
  const dispatch = useDispatch()
  //- redux中，工作区需要渲染的组件列表
  const workbenchList: any = useSelector<WorkbenchListState>(state => state.workbenchList.data)
  const menuActiveItem: any = useSelector<ComponentMenuState>(state => state.componentMenu.activeItem)
  const dropStatus: any = useSelector<WorkbenchListState>(state => state.workbenchList.dropStatus)

  // 容器点击事件
  const containerMouseDown = (e: any) => {
    if (e.target.className === 'workbench-container') {
      dispatch(delAllSelect())
      dispatch(setActiveItem(null))
    }
  }
  // 放置元素
  const drop = (e: any) => {
    // 只处理menuItem的放置事件
    if (!menuActiveItem) return;
    // 得到元素的位置
    const [left, top] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
    // 往工作区添加组件
    let addItem = {
      id: uuid(),
      type: menuActiveItem.type,
      focus: false,
      args: {
        value: menuActiveItem.args.value,
        style: {
          ...menuActiveItem.args.style,
          position: 'absolute',
          left: left + 'px',
          top: top + 'px'
        }
      }
    }
    dispatch(addElement(addItem))
  }
  return (
    <div
      className='workbench-container'
      onDragLeave={() => { dispatch(setDropStatus(false)); }}
      onDragOver={(e) => { e.preventDefault(); !dropStatus && dispatch(setDropStatus(true)); }}
      onDrop={drop}
      onMouseDown={containerMouseDown}
    >
      {/* 渲染工作台 */}
      {workbenchList.map((item: CompItem_Workbench) => {
        if (item.args.style.position === 'static') {
          return componentMap[item.type]({
            ...item.args,
            style: {
              ...item.args.style,
              position: 'relative',
              left: 0,
              top: 0
            },
          })
        } else {
          return <WorkbenchItem key={item.id} compInfo={item} />
        }
      })}
    </div >
  )
}

export default Workbench