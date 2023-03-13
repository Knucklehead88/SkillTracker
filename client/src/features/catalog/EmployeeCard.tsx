import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Employee } from "../../app/models/employee";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { addBasketItemAsync } from "../basket/basketSlice";
import avatarImage from '../../../public/images/silhouette.png';

interface Props {
    product: Employee
}


export default function EmployeeCard({ product }: Props) {
    const {status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.userName.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.userName}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image="/images/silhouette.png"
                title={product.userName}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    {product.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.job} - {product.skill}
                </Typography>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/employees/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    )
}