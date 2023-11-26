import { getIndustrieById } from "@/utils/projectsUtils";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";

interface ProjectProps {
  data: {
    id: bigint;
    name: string;
    industrie: number;
  }
}

export default function ProjectCard({ data }: ProjectProps) {
  return (
    <>
      <Grid item key={data.id} xs={12} sm={6} md={4}>
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <CardMedia
            component="div"
            sx={{
              // 16:9
              pt: '56.25%',
            }}
            image="https://source.unsplash.com/random?wallpapers"
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {data.name}
            </Typography>
            <Typography>
              {getIndustrieById(data.industrie.toString())?.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View</Button>
            <Button size="small">Edit</Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
