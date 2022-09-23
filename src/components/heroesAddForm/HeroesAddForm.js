import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage,useField } from 'formik';
import * as Yup from 'yup'
import { useDispatch} from 'react-redux';
import { heroesAdding } from '../heroesList/heroesSlice';
import { useState} from 'react';
import { useHttp } from '../../hooks/http.hook';
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const dispatch = useDispatch()
    const [hero, setHero] = useState(null)
    const { request } = useHttp()
    return (
        <div className="border p-4 shadow-lg rounded">
            <Formik
                initialValues={{
                    name: '',
                    description: '',
                    element: '',
                }}
                 validationSchema={Yup.object({
                name: Yup.string()
                    .min(2, 'Min 2 symbols!')
                    .required('Necessary field!'),
                description: Yup.string()
                    .min(10, 'More then 9 symbols')
                         .required('Necessary field'),
                  element: Yup.string()
                    .required('Necessary field!'),
                
            })}
                onSubmit={(values) => {
                    const hero = {
            id: uuidv4(),
            name: values.name,
            description: values.description,
            element: values.element
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
            .then(res => console.log(res, 'Отправка успешна'))
            .then(dispatch(heroesAdding(hero)))
            .catch(err => console.log(err));
                   }}
            
            >
                <Form>
                      <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <Field
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>
   <FormikErrorMessage className='char__search-error' name='name' component='div' />
            <div className="mb-3">
                <label htmlFor="description" className="form-label fs-4">Описание</label>
                <Field
                    required
                    name="description" 
                    className="form-control" 
                            id="description" 
                            as ='textarea'
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>
   <FormikErrorMessage className='char__search-error' name='description' component='div' />
            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <Field 
                    required
                    className="form-select" 
                    id="element"
                    as = 'select'    
                    name="element">
                    <option >Я владею элементом...</option>
                    <option value="fire">Огонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Ветер</option>
                    <option value="earth">Земля</option>
                
                </Field>
                </div>
                   <FormikErrorMessage className='char__search-error' name='element' component='div' />
            <button type="submit" className="btn btn-primary">Создать</button>
   
                </Form>
                       </Formik>
        </div>
    )
}

export default HeroesAddForm;