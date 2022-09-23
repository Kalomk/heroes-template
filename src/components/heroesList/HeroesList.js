import './heroList.scss'
import { useHttp } from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition,TransitionGroup } from "react-transition-group";
import { heroesDeleting,fetchHeroes,heroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';


const HeroesList = () => {
 
    const heroes = useSelector(heroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus)
    const dispatch = useDispatch();
    const {request} = useHttp();
    useEffect(() => {
       dispatch(fetchHeroes(request))
    }, []);
    const onDelete = useCallback((id) => {
     request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(()=> console.log('Deleting heroe success'))
            .then(data => dispatch(heroesDeleting(id)))
            .catch(() => console.log('Error'))
 },[request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            <CSSTransition
                timeout={0}
            classNames = 'hero-list__items'>
             <h5 className="text-center mt-5">Героев пока нет</h5>
           </CSSTransition>
        }

        return arr.map(({id, ...props}) => {
            return <CSSTransition classNames ='hero-list__items' timeout={500} key ={id}>
                <HeroesListItem  onDelete={() => onDelete(id)}
                    key={id}
                    {...props} />
                </CSSTransition>
        })
    }

    const elements = renderHeroesList(heroes);
    return (
            <TransitionGroup component='ul'>
                 {elements}
           </TransitionGroup>
    )
}

export default HeroesList;