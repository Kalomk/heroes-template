import classNames from 'classnames';
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { changeHeroFilter,fetchFilters } from './heroesFilterSilce';
import Spinner from '../spinner/Spinner';


const HeroesFilters = () => {
    const dispatch = useDispatch()
     const {filters, filtersLoadingStatus,activeFilter} = useSelector(state => state.filters);
    const { request } = useHttp();
    
useEffect(() => {
    dispatch(fetchFilters(request))
}, []);
    
if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }



    const elements = filters.map((item) => {
        
        const btnClass = classNames('btn', item.clazz, {
                'active': item.name === activeFilter
        });
        return (
            <button key={item.name}
                id={item.name}
                className={btnClass}
                onClick={() => dispatch(changeHeroFilter(item.name))}
            >{item.label}</button>
        )
    })
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;